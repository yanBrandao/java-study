import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Obtenha essas credenciais em app.tina.io para modo cloud
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },

  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "static",
    },
  },

  schema: {
    collections: [
      {
        name: "doc",
        label: "Perguntas",
        path: "entrevista-java",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "number",
            name: "sidebar_position",
            label: "Posição no Menu",
          },
          {
            type: "string",
            name: "slug",
            label: "Slug (URL)",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Conteúdo",
            isBody: true,
          },
        ],
      },
    ],
  },
});
