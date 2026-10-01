const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_.]+$/;

export function validateLogin({ username, password }) {
  const e = {};
  if (!username.trim()) e.username = 'Foydalanuvchi nomini kiriting';
  if (!password) e.password = 'Parolni kiriting';
  return e;
}

export function validateRegister({ username, email, password, confirm }) {
  const e = {};
  const name = username.trim();
  if (name.length < 3) e.username = "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lsin";
  else if (!USERNAME_RE.test(name)) e.username = 'Faqat harf, raqam, _ va . ishlating';
  if (!EMAIL_RE.test(email.trim())) e.email = "To'g'ri email kiriting";
  if (password.length < 6) e.password = "Parol kamida 6 ta belgidan iborat bo'lsin";
  if (confirm !== password) e.confirm = 'Parollar mos kelmadi';
  return e;
}