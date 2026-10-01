import { request } from './client.js';

const enc = encodeURIComponent;

// GET /user/login javobi: "logged in user session:123456"
const sessionToken = (res) => String(res?.message ?? '').split(':').pop().trim();

export async function register({ username, email, password }) {
  const exists = await request(`/user/${enc(username)}`).then(
    () => true,
    (e) => {
      if (e.status === 404) return false;
      throw e;
    },
  );
  if (exists) throw new Error('Bu foydalanuvchi nomi band, boshqasini tanlang');

  const user = {
    id: Date.now(),
    username,
    firstName: username,
    lastName: '',
    email,
    password,
    phone: '',
    userStatus: 1,
  };
  await request('/user', { method: 'POST', body: user });

  const res = await request('/user/login', { params: { username, password } });
  return { token: sessionToken(res), user: { id: user.id, username } };
}

export async function login({ username, password }) {
  const found = await request(`/user/${enc(username)}`).catch((e) => {
    if (e.status === 404) throw new Error('Bunday foydalanuvchi topilmadi');
    throw e;
  });
  if (found.password !== password) throw new Error("Parol noto'g'ri");

  const res = await request('/user/login', { params: { username, password } });
  return { token: sessionToken(res), user: { id: found.id, username: found.username } };
}