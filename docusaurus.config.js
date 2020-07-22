const COPYRIGHT = `Copyright © ${new Date().getFullYear()} Ripple`
module.exports = {
  title: 'Ripple',
  tagline: '',
  url: 'https://ripple-run.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'ripple-run',
  projectName: 'ripple-run.github.io',
  themeConfig: {
    navbar: {
      title: 'RIPPLE',
      hideOnScroll: true,
      logo: {
        alt: 'ripple run',
        src: 'img/logo.svg',
        srcDark: 'img/logo_light.svg',
      },
    },
    footer: {
      copyright: COPYRIGHT,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      defaultLanguage: 'javascript',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          path: './blog',
          routeBasePath: '/',
          feedOptions: {
            type: 'all',
            copyright: COPYRIGHT,
          },
          showReadingTime: true,
          postPerPage: 10,
          include: ['*.md', '*.mdx'],
          truncateMarker: /<!--\s*(truncate)\s*-->/,
          showReadingTime: true,
          editUrl:
            'https://github.com/ripple-run/ripple-run.github.io/edit/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
