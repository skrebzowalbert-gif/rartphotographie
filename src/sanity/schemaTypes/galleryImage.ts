import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Galerie-Bild",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "Portrait", value: "portrait" },
          { title: "Familie", value: "family" },
          { title: "Babybauch", value: "babybauch" },
          { title: "Newborn", value: "newborn" },
          { title: "Hochzeit", value: "wedding" },
          { title: "Event", value: "event" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt-Text",
      type: "string",
      description:
        "Kurze Bildbeschreibung für Google und Barrierefreiheit, z. B. Portraitshooting Kaufbeuren R.ArtPhotographie.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Sichtbar",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "image",
    },
    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
});
