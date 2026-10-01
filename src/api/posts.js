import { request } from './client.js';
import { getStoredUser } from '../utils/storage.js';

const APP = 'blog-1-dars'; // faqat shu belgili petlar post hisoblanadi

function toPost(pet) {
  let meta;
  try {
    meta = JSON.parse(pet.category?.name);
  } catch {
    return null;
  }
  if (meta?.app !== APP) return null;
  return {
    id: pet.id,
    title: pet.name,
    content: meta.content,
    imageUrl: pet.photoUrls?.[0] ?? null,
    createdAt: meta.createdAt,
    tags: (pet.tags ?? []).map((t) => ({ id: t.id, name: t.name })),
    author: { id: meta.authorId, username: meta.author },
  };
}

export async function getPosts({ search, sort = 'new', tag, author } = {}) {
  const pets = await request('/pet/findByStatus', { params: { status: 'available' } });
  let list = pets.map(toPost).filter(Boolean);

  if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  if (tag) list = list.filter((p) => p.tags.some((t) => t.name === tag));
  if (author) list = list.filter((p) => p.author.username === author);

  const byDate = (a, b) => new Date(a.createdAt) - new Date(b.createdAt) || a.id - b.id;
  if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'old') list.sort(byDate);
  else list.sort((a, b) => byDate(b, a));
  return list;
}

export async function createPost({ title, content, imageUrl, tags = [] }) {
  const user = getStoredUser();
  if (!user) throw new Error('Avval tizimga kiring');

  const meta = {
    app: APP,
    content,
    author: user.username,
    authorId: user.id,
    createdAt: new Date().toISOString(),
  };
  const uniqueTags = [...new Set(tags.map((t) => t.toLowerCase()))];

  const pet = await request('/pet', {
    method: 'POST',
    body: {
      id: Date.now(),
      category: { id: 0, name: JSON.stringify(meta) },
      name: title,
      photoUrls: imageUrl ? [imageUrl] : [],
      tags: uniqueTags.map((name, i) => ({ id: i + 1, name })),
      status: 'available',
    },
  });
  return toPost(pet);
}