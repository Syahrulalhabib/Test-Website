// utils/validator.js
function validateRegister({ email, password, fullname }) {
  if (!email || !password || !fullname) {
    return 'Email, password, dan nama lengkap wajib diisi';
  }
  if (password.length < 6) {
    return 'Password minimal 6 karakter';
  }
  return null;
}

module.exports = { validateRegister };
