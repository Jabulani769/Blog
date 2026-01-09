// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');

export const GET = () => rss({
  title: 'JABU . Blog',
  description: 'Thoughts on web dev,life views, and tech vibes in general from Blantyre',
  site: import.meta.env.SITE || 'https://jkblog.vercel.app', 
  items: posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description || '',
    link: `/blog/${post.slug}/`,
  })),
});