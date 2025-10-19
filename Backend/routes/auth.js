// routes/auth.js
const { db, auth } = require('../config/firebase');
const { validateRegister } = require('../utils/validator');

module.exports = [
  // === REGISTER USER BARU ===
  {
    method: 'POST',
    path: '/register',
    handler: async (request, h) => {
      const { email, password, fullname, gender } = request.payload;

      const validationError = validateRegister({ email, password, fullname });
      if (validationError) {
        return h.response({ message: validationError }).code(400);
      }

      try {
        // Buat user di Firebase Authentication
        const userRecord = await auth.createUser({
          email,
          password,
          displayName: fullname,
        });

        // Simpan data tambahan ke Firestore
        await db.collection('users').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email,
          fullname,
          gender,
          createdAt: new Date(),
          provider: 'password',
        });

        return h
          .response({
            message: 'User berhasil terdaftar',
            uid: userRecord.uid,
            email: userRecord.email,
          })
          .code(201);
      } catch (err) {
        console.error('🔥 Register error:', err);
        return h
          .response({ message: 'Gagal membuat user', error: err.message })
          .code(500);
      }
    },
  },

  // === LOGIN DENGAN GOOGLE ===
  {
    method: 'POST',
    path: '/google-login',
    handler: async (request, h) => {
      const { idToken } = request.payload;
      if (!idToken) {
        return h.response({ message: 'ID token tidak ditemukan' }).code(400);
      }

      try {
        // Verifikasi token dari Firebase Client SDK
        const decoded = await auth.verifyIdToken(idToken);
        const { uid, email, name, picture } = decoded;

        // Simpan ke Firestore jika belum ada
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
          const newUser = {
            uid,
            email,
            fullname: name || '',
            photoURL: picture || '',
            provider: 'google',
            createdAt: new Date(),
          };
          await userRef.set(newUser);
          console.log(`✅ User baru disimpan: ${email}`);
        }

        return h.response({
          message: 'Login Google berhasil',
          user: { uid, email, name, picture },
        });
      } catch (err) {
        console.error('🔥 Error Google login:', err);
        return h.response({ message: err.message }).code(500);
      }
    },
  },

  // === PROFIL USER ===
  {
    method: 'GET',
    path: '/profile',
    handler: async (request, h) => {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return h.response({ message: 'Token tidak ditemukan' }).code(401);
      }

      const token = authHeader.replace('Bearer ', '');
      try {
        const decoded = await auth.verifyIdToken(token);
        const userDoc = await db.collection('users').doc(decoded.uid).get();

        if (!userDoc.exists) {
          return h.response({ message: 'User tidak ditemukan' }).code(404);
        }

        return h.response(userDoc.data()).code(200);
      } catch (err) {
        return h.response({ message: err.message }).code(401);
      }
    },
  },
];
