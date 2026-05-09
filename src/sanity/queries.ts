import { groq } from "next-sanity";
import { isSanityConfigured } from "./env";
import { sanityClient } from "./client";

export type SanityGalleryCategory =
  | "portrait"
  | "family"
  | "babybauch"
  | "newborn"
  | "wedding"
  | "event";

export type SanityGalleryImage = {
  id: string;
  title?: string;
  category: SanityGalleryCategory;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  order?: number;
};

export type SanityPromotion = {
  id: string;
  title: string;
  badge?: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
  appliesTo?: "vouchers" | "shootings" | "all";
  discountType?: "none" | "percent" | "fixed";
  discountValue?: number;
  promoCode?: string;
  order?: number;
};

const galleryImagesQuery = groq`
  *[
    _type == "galleryImage" &&
    !(_id in path("drafts.**")) &&
    isActive == true &&
    defined(image.asset) &&
    defined(category)
  ] | order(order asc, _createdAt asc) {
    "id": _id,
    title,
    category,
    "src": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    alt,
    order
  }
`;

const activePromotionsQuery = groq`
  *[
    _type == "promotion" &&
    !(_id in path("drafts.**")) &&
    isActive == true &&
    defined(title) &&
    defined(text) &&
    (!defined(startDate) || startDate <= now()) &&
    (!defined(endDate) || endDate >= now())
  ] | order(order asc, _createdAt asc) {
    "id": _id,
    title,
    badge,
    text,
    buttonText,
    buttonLink,
    "appliesTo": coalesce(appliesTo, "vouchers"),
    "discountType": coalesce(discountType, "none"),
    discountValue,
    promoCode,
    order
  }
`;

export async function getGalleryImages() {
  if (!isSanityConfigured || !sanityClient) {
    return [];
  }

  try {
    return await sanityClient.fetch<SanityGalleryImage[]>(
      galleryImagesQuery,
      {},
      { next: { revalidate: 300 } }
    );
  } catch {
    return [];
  }
}

export async function getActivePromotions() {
  if (!isSanityConfigured || !sanityClient) {
    return [];
  }

  try {
    const freshClient = sanityClient.withConfig({ useCdn: false });

    return await freshClient.fetch<SanityPromotion[]>(
      activePromotionsQuery,
      {},
      { cache: "no-store" }
    );
  } catch {
    return [];
  }
}
