const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    configure: { entry: './src/frontend/index.jsx' },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
