const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    console.log("SETUP PROXY");
    app.use(createProxyMiddleware('/api', {target: 'http://localhost:9696'}));
};
