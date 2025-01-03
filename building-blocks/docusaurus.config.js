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
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/ai-katas/ai-building-blocks/tree/main/",
          routeBasePath: "/",
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
          type: "dropdown",
          label: "Capabilities",
          position: "left",
          items: [
            {
              label: "Text Understanding",
              to: "capabilities/text-understanding",
            },
            {
              label: "Image Understanding",
              to: "capabilities/image-understanding",
            },
            {
              label: "Audio Understanding",
              to: "capabilities/audio-understanding",
            },
            {
              label: "Code Understanding",
              to: "capabilities/code-understanding",
            },
            {
              label: "3D Scene Understanding",
              to: "capabilities/3d-scene-understanding",
            },
            {
              label: "Multi-Modal Understanding",
              to: "capabilities/multi-modal-understanding",
            },
            {
              label: "Text Generation",
              to: "capabilities/text-generation",
            },
            {
              label: "Image Generation",
              to: "capabilities/image-generation",
            },
            {
              label: "Audio Generation",
              to: "capabilities/audio-generation",
            },
            {
              label: "Code Generation",
              to: "capabilities/code-generation",
            },
            {
              label: "3D Scene Generation",
              to: "capabilities/3d-scene-generation",
            },
            {
              label: "Pattern Discovery",
              to: "capabilities/pattern-discovery",
            },
            {
              label: "Automated Decision Making",
              to: "capabilities/automated-decision-making",
            },
            {
              label: "Unexpected Event Detection",
              to: "capabilities/unexpected-event-detection",
            },
            {
              label: "Classification",
              to: "capabilities/classification",
            },
            {
              label: "Forecasting",
              to: "capabilities/forecasting",
            },
            {
              label: "Recommendation",
              to: "capabilities/recommendation",
            },
            {
              label: "Similarity Search",
              to: "capabilities/similarity-search",
            },
          ],
        },
        {
          type: "dropdown",
          label: "Solutions",
          position: "left",
          items: [
            {
              label: "Solutions",
              to: "solutions",
            },
            {
              label: "3D Modeling",
              to: "solutions/3d-modeling",
            },
            {
              label: "Neural Rendering",
              to: "solutions/neural-rendering",
            },
            {
              label: "Object Detection",
              to: "solutions/object-detection",
            },
            {
              label: "Semantic Segmentation",
              to: "solutions/semantic-segmentation",
            },
            {
              label: "Audio Classification",
              to: "solutions/audio-classification",
            },
            {
              label: "Autonomous Systems",
              to: "solutions/autonomous-systems",
            },
            {
              label: "Code Intelligence",
              to: "solutions/code-intelligence",
            },
            {
              label: "Collaborative Filtering",
              to: "solutions/collaborative-filtering",
            },
            {
              label: "Computer Vision",
              to: "solutions/computer-vision",
            },
            {
              label: "Content-Based Filtering",
              to: "solutions/content-based-filtering",
            },
            {
              label: "Cross-Modal Learning",
              to: "solutions/cross-modal-learning",
            },
            {
              label: "Decision Intelligence",
              to: "solutions/decision-intelligence",
            },
            {
              label: "Generative Models",
              to: "solutions/generative-models",
            },
            {
              label: "Image Classification",
              to: "solutions/image-classification",
            },
            {
              label: "Language Modeling",
              to: "solutions/language-modeling",
            },
            {
              label: "Machine Translation",
              to: "solutions/machine-translation",
            },
            {
              label: "Multi-Class Classification",
              to: "solutions/multi-class-classification",
            },
            {
              label: "Named Entity Recognition",
              to: "solutions/named-entity-recognition",
            },
            {
              label: "Natural Language Processing",
              to: "solutions/natural-language-processing",
            },
            {
              label: "Network Analysis",
              to: "solutions/network-analysis",
            },
            {
              label: "Neural Search",
              to: "solutions/neural-search",
            },
            {
              label: "Outlier Detection",
              to: "solutions/outlier-detection",
            },
            {
              label: "Pattern Mining",
              to: "solutions/pattern-mining",
            },
            {
              label: "Pattern Recognition",
              to: "solutions/pattern-recognition",
            },
            {
              label: "Predictive Analytics",
              to: "solutions/predictive-analytics",
            },
            {
              label: "Program Synthesis",
              to: "solutions/program-synthesis",
            },
            {
              label: "Real-Time Analytics",
              to: "solutions/real-time-analytics",
            },
            {
              label: "Sentiment Analysis",
              to: "solutions/sentiment-analysis",
            },
            {
              label: "Sequential Modeling",
              to: "solutions/sequential-modeling",
            },
            {
              label: "Speech Recognition",
              to: "solutions/speech-recognition",
            },
            {
              label: "Speech Synthesis",
              to: "solutions/speech-synthesis",
            },
            {
              label: "Static Analysis",
              to: "solutions/static-analysis",
            },
            {
              label: "Style Transfer",
              to: "solutions/style-transfer",
            },
            {
              label: "Vector Databases",
              to: "solutions/vector-databases",
            },
          ],
        },
        {
          type: "dropdown",
          label: "Tools",
          position: "left",
          items: [
            {
              label: "Tools",
              to: "tools",
            },
          ],
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
      copyright: `Copyright © ${new Date().getFullYear()} Your Organization Name`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
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
