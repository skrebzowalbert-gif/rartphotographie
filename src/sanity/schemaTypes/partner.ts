import { defineField, defineType } from "sanity";

const partnerCategories = [
  { title: "Location", value: "location" },
  { title: "Hochzeitstorte", value: "cake" },
  { title: "Video", value: "video" },
  { title: "Make-up", value: "makeup" },
  { title: "Floristik", value: "florist" },
  { title: "Brautmode", value: "bridal-fashion" },
  { title: "Musik / DJ", value: "music" },
  { title: "Fahrzeug", value: "vehicle" },
  { title: "Sonstiges", value: "other" },
];

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      options: {
        list: partnerCategories,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Beschreibung",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "websiteUrl",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "isFeatured",
      title: "Hervorgehoben",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isClosePartner",
      title: "Enger Partner",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "showOnHomepage",
      title: "Auf Startseite anzeigen",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "showOnWeddingPage",
      title: "Auf Preise-/Hochzeitsseite anzeigen",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "showOnContactPage",
      title: "Auf Kontaktseite anzeigen",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isActive",
      title: "Aktiv",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category",
      isClosePartner: "isClosePartner",
      media: "logo",
    },
    prepare({ title, category, isClosePartner, media }) {
      return {
        title,
        subtitle: `${category || "Partner"}${
          isClosePartner ? " · Enger Partner" : ""
        }`,
        media,
      };
    },
  },
});
