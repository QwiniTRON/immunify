const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(createProxyMiddleware(process.env.REACT_APP_API_VERSION + "/**", {
    target: process.env.REACT_APP_PROXY_ADDRESS,
    secure: false
  }));
};
