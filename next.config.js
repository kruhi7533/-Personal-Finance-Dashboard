// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://personal-finance-dashboard-2jkx.onrender.com/api/:path*' // Your Render URL
          : 'http://localhost:5001/api/:path*',
      },
    ];
  },
};
