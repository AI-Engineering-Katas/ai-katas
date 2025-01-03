import { themes as prismThemes } from "prism-react-renderer";

const config = {
  title: "AI Building Blocks",
  tagline: "Compendium of capabilities, solutions, and tools",
  url: "https://ai-katas.com",
  baseUrl: "/ai-katas/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "AI-Engineering-Katas",
  projectName: "ai-katas",

  presets: [
    [
      "classic",
      {
        docs: {
          // sidebarPath: "./sidebars.js",
          routeBasePath: "/",
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          // sidebar_hide_name: true,
          // hideSidebar: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "AI Building Blocks",
      items: [
        {
          label: "Capabilities",
          to: "capabilities",
          position: "left",
        },
        {
          label: "Solutions",
          to: "solutions",
          position: "left",
        },
        {
          label: "Tools",
          to: "tools",
          position: "left",
        },
        {
          href: "https://github.com/ai-katas/ai-building-blocks",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Capabilities",
              to: "capabilities",
            },
            {
              label: "Solutions",
              to: "solutions",
            },
            {
              label: "Tools",
              to: "tools",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Engineering Katas`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  },

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: "/",
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
      },
    ],
  ],

  baseUrlIssueBanner: true,
  i18n: {
    defaultLocale: "en",
    path: "i18n",
    locales: ["en"],
    localeConfigs: {},
  },

  markdown: {
    format: "mdx",
    mermaid: false,
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },
};

export default config;
