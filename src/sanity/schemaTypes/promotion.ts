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
      name: "appliesTo",
      title: "Gilt für",
      type: "string",
      initialValue: "vouchers",
      options: {
        list: [
          { title: "Gutscheine", value: "vouchers" },
          { title: "Shootings", value: "shootings" },
          { title: "Alles", value: "all" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "discountType",
      title: "Rabattart",
      type: "string",
      initialValue: "none",
      options: {
        list: [
          { title: "Kein Rabatt", value: "none" },
          { title: "Prozent", value: "percent" },
          { title: "Fester Betrag", value: "fixed" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "discountValue",
      title: "Rabattwert",
      type: "number",
      description: "Bei Prozent z. B. 10 für 10 %.",
    }),
    defineField({
      name: "promoCode",
      title: "Aktionscode",
      type: "string",
      description: "Optional, z. B. NEU10.",
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
