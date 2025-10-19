// server.js
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const authRoutes = require('./routes/auth');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Izinkan akses dari React (localhost:3000)
        headers: ['Accept', 'Content-Type', 'Authorization'],
        additionalHeaders: ['cache-control', 'x-requested-with'],
      },
    },
  });


  // === Endpoint untuk kirim konfigurasi publik ke frontend ===
  server.route({
    method: 'GET',
    path: '/config',
    handler: (request, h) => {
      return {
        BACKEND_URL: process.env.BACKEND_URL,
        firebaseConfig: {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
        },
      };
    },
  });

  // === Route autentikasi (register, login, google-login, dll) ===
  server.route(authRoutes);

  // === Error handler global ===
  process.on('unhandledRejection', (err) => {
    console.error('🔥 Unhandled rejection:', err);
    process.exit(1);
  });

  await server.start();
  console.log(`🚀 Server running at: ${server.info.uri}`);
};

init();
