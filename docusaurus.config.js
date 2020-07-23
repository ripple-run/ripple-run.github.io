const math = require('remark-math');
const katex = require('rehype-katex');
const containers = require('remark-containers');

const COPYRIGHT = `Copyright © ${new Date().getFullYear()} Ripple`;
module.exports = {
  title: 'Ripple',
  tagline: '',
  url: 'https://ripple-run.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'ripple-run',
  projectName: 'ripple-run.github.io',
  stylesheets: ['https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/katex.min.css'],
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
      theme: require('prism-react-renderer/themes/dracula'),
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
          remarkPlugins: [containers, math],
          rehypePlugins: [katex],
          editUrl:
            'https://github.com/ripple-run/ripple-run.github.io/edit/docs/',
          admonitions: {
            tag: ':::',
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
