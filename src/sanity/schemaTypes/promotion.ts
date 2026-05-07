import { defineField, defineType } from "sanity";

export const promotion = defineType({
  name: "promotion",
  title: "Aktion / Hinweis",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Aktiv",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Optional, z. B. Neueröffnung, Muttertag oder Sommeraktion.",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonText",
      title: "Button-Text",
      type: "string",
      description: "Optional, z. B. Gutscheine ansehen.",
    }),
    defineField({
      name: "buttonLink",
      title: "Button-Link",
      type: "string",
      description: "Optional, z. B. /gutscheine oder eine externe URL.",
    }),
    defineField({
      name: "startDate",
      title: "Startdatum",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "Enddatum",
      type: "datetime",
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
      title: "title",
      isActive: "isActive",
      badge: "badge",
    },
    prepare({ title, isActive, badge }) {
      return {
        title,
        subtitle: `${isActive ? "Aktiv" : "Inaktiv"}${
          badge ? ` · ${badge}` : ""
        }`,
      };
    },
  },
});
