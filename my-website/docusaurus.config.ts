import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'DocShield - Project Progress',
  tagline: 'An easy and convenient tool designed to anonymize confidential documents securely and efficiently.',
  favicon: 'assets/logo.png',

  future: {
    v4: true,
  },

  url: 'https://pei-docshield.github.io',
  baseUrl: '/DocShieldSite/',
  trailingSlash: false,

  organizationName: 'PEI-DocShield',
  projectName: 'DocShieldSite',

  onBrokenLinks: 'ignore',
  onBrokenAnchors: 'ignore',

  i18n: {
    defaultLocale: 'pt',
    locales: ['pt'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'assets/logoCompleta.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'DocShield Logo',
        src: 'assets/logoCompleta.png',
      },
      items: [
        {to: '/#minutes', label: 'Minutes', position: 'left'},
        {to: '/#calendar', label: 'Calendar', position: 'left'},
        {
          type: 'dropdown',
          label: 'Milestones',
          position: 'left',
          items: [
            {label: 'Milestone 1', to: '/#milestone-1'},
            {label: 'Milestone 2', to: '/#milestone-2'},
            {label: 'Milestone 3', to: '/#milestone-3'},
            {label: 'Milestone 4', to: '/#milestone-4'},
          ],
        },
        {to: '/#team', label: 'Team', position: 'left'},
        {to: '/docs/intro', label: 'Documentation', position: 'left'},
        {
          href: 'https://github.com/PEI-DocShield',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub Repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} DocShield. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

