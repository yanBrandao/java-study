import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  markdown: {
    format: 'md',
  },
  title: 'Java Study',
  tagline: 'Perguntas e respostas para entrevistas técnicas de Java',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://yanBrandao.github.io',
  baseUrl: '/java-study/',

  organizationName: 'yanBrandao',
  projectName: 'java-study',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  plugins: [
    './src/plugins/questions-plugin.ts',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../entrevista-java',
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl:
            'https://github.com/yanBrandao/java-study/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Java Study',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Perguntas',
        },
        {
          to: '/simulado',
          label: 'Simulado',
          position: 'left',
        },
        {
          href: 'https://github.com/yanBrandao/java-study',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Conteúdo',
          items: [
            {
              label: 'Perguntas',
              to: '/',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/yanBrandao/java-study',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Java Study. Construído com Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'sql', 'bash', 'yaml', 'properties'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
