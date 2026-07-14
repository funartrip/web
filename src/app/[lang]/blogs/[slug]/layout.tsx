import { client } from '@/sanity/lib/client';
import { Metadata } from 'next';

// 🌐 伺服器端獨立運作的 Blog SEO 引擎
export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang || 'zh_tw').toLowerCase().replace('-', '_');

  const query = `*[_type == "blogPost" && slug.current == $slug && publishStatus == "published"][0] { 
    title, 
    summary, 
    seoKeywords, 
    "thumbnailUrl": thumbnail.asset->url 
  }`;
  const post = await client.fetch(query, { slug: resolvedParams.slug });
  if (!post) return {};

  const getLabel = (field: any, l: string) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[l] || field['zh_tw'] || Object.values(field).find(v => v) || '';
  };

  const pageTitle = getLabel(post.title, lang);
  const pageDesc = getLabel(post.summary, lang);
  const rawKeywords = post.seoKeywords || '';

  const defaultKeywords = ['Fun ArTrip', '楓藝', '法國日常旅行誌', '藝術導覽隨筆'];
  const customKeywords = rawKeywords.split(',').map((k: string) => k.trim()).filter(Boolean);
  const finalKeywords = [...customKeywords, ...defaultKeywords];

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: finalKeywords,
    openGraph: {
      title: `${pageTitle} | Fun ArTrip 楓藝`,
      description: pageDesc,
      images: post.thumbnailUrl ? [{ url: post.thumbnailUrl }] : [],
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}