import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

type SanityImageSource = Parameters<
  ReturnType<typeof imageUrlBuilder>["image"]
>[0];

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: SanityImageSource) {
  if (!builder) return null;

  return builder.image(source);
}
