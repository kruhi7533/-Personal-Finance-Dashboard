// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://finflow-api.onrender.com/api/:path*' // Your Render URL
          : 'http://localhost:5001/api/:path*',
      },
    ];
  },
};
