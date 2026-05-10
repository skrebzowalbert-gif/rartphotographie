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

export type SanityPartnerCategory =
  | "location"
  | "cake"
  | "video"
  | "makeup"
  | "florist"
  | "bridal-fashion"
  | "music"
  | "vehicle"
  | "other";

export type SanityPartner = {
  id: string;
  name: string;
  slug?: string;
  category?: SanityPartnerCategory | string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
  isFeatured?: boolean;
  isClosePartner?: boolean;
  showOnHomepage?: boolean;
  showOnWeddingPage?: boolean;
  showOnContactPage?: boolean;
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

const partnerProjection = groq`
  "id": _id,
  name,
  "slug": slug.current,
  category,
  "logoUrl": logo.asset->url,
  description,
  websiteUrl,
  isFeatured,
  isClosePartner,
  showOnHomepage,
  showOnWeddingPage,
  showOnContactPage,
  order
`;

const activePartnersQuery = groq`
  *[
    _type == "partner" &&
    !(_id in path("drafts.**")) &&
    isActive == true
  ] | order(isFeatured desc, order asc, _createdAt asc) {
    ${partnerProjection}
  }
`;

const homepagePartnersQuery = groq`
  *[
    _type == "partner" &&
    !(_id in path("drafts.**")) &&
    isActive == true &&
    showOnHomepage == true
  ] | order(isFeatured desc, order asc, _createdAt asc) {
    ${partnerProjection}
  }
`;

const weddingPartnersQuery = groq`
  *[
    _type == "partner" &&
    !(_id in path("drafts.**")) &&
    isActive == true &&
    showOnWeddingPage == true
  ] | order(isFeatured desc, order asc, _createdAt asc) {
    ${partnerProjection}
  }
`;

const contactPartnersQuery = groq`
  *[
    _type == "partner" &&
    !(_id in path("drafts.**")) &&
    isActive == true &&
    showOnContactPage == true
  ] | order(isFeatured desc, order asc, _createdAt asc) {
    ${partnerProjection}
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

async function fetchPartners(query: string) {
  if (!isSanityConfigured || !sanityClient) {
    return [];
  }

  try {
    const freshClient = sanityClient.withConfig({ useCdn: false });

    return await freshClient.fetch<SanityPartner[]>(
      query,
      {},
      { cache: "no-store" }
    );
  } catch {
    return [];
  }
}

export async function getActivePartners() {
  return fetchPartners(activePartnersQuery);
}

export async function getHomepagePartners() {
  return fetchPartners(homepagePartnersQuery);
}

export async function getWeddingPartners() {
  return fetchPartners(weddingPartnersQuery);
}

export async function getContactPartners() {
  return fetchPartners(contactPartnersQuery);
}
