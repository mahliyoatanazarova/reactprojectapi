import { getPosts } from './posts.js';

// Petstore'da teglar endpointi yo'q, shuning uchun postlardan sanaymiz
export async function getTags() {
  const posts = await getPosts();
  const count = {};
  posts.forEach((p) => p.tags.forEach((t) => { count[t.name] = (count[t.name] ?? 0) + 1; }));
  return Object.entries(count).map(([name, c]) => ({ name, count: c }));
}