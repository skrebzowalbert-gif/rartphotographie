import { groq } from "next-sanity";
import { isSanityConfigured } from "@/sanity/env";
import { sanityClient } from "@/sanity/client";

export type SanityGalleryCategory =
  | "portrait"
  | "family"
  | "babybauch"
  | "newborn"
  | "wedding"
  | "event";

export type SanityGalleryImage = {
  title?: string;
  category: SanityGalleryCategory;
  src: string;
  alt: string;
  order?: number;
};

const galleryImagesQuery = groq`
  *[
    _type == "galleryImage" &&
    isActive == true &&
    defined(image.asset) &&
    defined(category)
  ] | order(order asc, _createdAt asc) {
    title,
    category,
    "src": image.asset->url,
    alt,
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
