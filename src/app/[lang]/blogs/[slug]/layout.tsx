import { client } from '@/sanity/lib/client';
import { Metadata } from 'next';

// 🌐 伺服器端獨立運作的 Blog SEO 引擎
export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang || 'zh_tw').toLowerCase().replace('-', '_');

  const tourQuery = `*[_type == "blogPost" && slug.current == $slug && publishStatus == "published"][0] { title, summary, tags, thumbnail }`;
  const post = await client.fetch(tourQuery, { slug: resolvedParams.slug });
  if (!post) return {};

  const getLabel = (field: any, l: string) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[l] || field['zh_tw'] || Object.values(field).find(v => v) || '';
  };

  const pageTitle = getLabel(post.title, lang);
  const pageDesc = getLabel(post.summary, lang);
  const postTags = post.tags || [];

  const defaultKeywords = ['Fun ArTrip', '楓藝', '法國日常旅行誌', '藝術導覽隨筆'];

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [...postTags, ...defaultKeywords],
    openGraph: {
      title: `${pageTitle} | Fun ArTrip 楓藝`,
      description: pageDesc,
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
  };
}
