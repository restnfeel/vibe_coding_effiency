import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '가성비 바이브 코딩 가이드',
  tagline: 'Quality · Speed · Cost 균형 잡는 AI 코딩 전략',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages 배포 설정
  url: 'https://restnfeel.github.io',
  baseUrl: '/vibe_coding_effiency/',

  organizationName: 'restnfeel',  // GitHub 사용자명
  projectName: 'vibe_coding_effiency',  // 저장소 이름
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',  // docs를 루트 경로로 서빙
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/restnfeel/vibe_coding_effiency/edit/main/',
        },
        blog: false,  // 블로그 비활성화
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '바이브 코딩 가이드',
      logo: {
        alt: 'Vibe Coding Guide',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '가이드',
        },
        {
          href: 'https://github.com/restnfeel/vibe_coding_effiency',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '가이드',
          items: [
            { label: '소개', to: '/' },
            { label: '전체 아키텍처', to: '/architecture' },
            { label: '모델 선정 전략', to: '/model-selection' },
          ],
        },
        {
          title: '실전',
          items: [
            { label: '실전 프롬프트', to: '/prompt-examples' },
            { label: '워크플로우', to: '/workflow' },
            { label: '체크리스트', to: '/checklist' },
          ],
        },
        {
          title: '링크',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/restnfeel/vibe_coding_effiency',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} restnfeel. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
