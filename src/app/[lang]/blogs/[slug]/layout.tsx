import { client } from '@/sanity/lib/client';
import { Metadata } from 'next';

// 🌐 伺服器端獨立運作的 Blog SEO 引擎
export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang || 'zh_tw').toLowerCase().replace('-', '_');

  // 🌟 修正點：將 thumbnail 轉為 thumbnailUrl 字串網址，防止伺服器序列化崩潰
  const tourQuery = `*[_type == "blogPost" && slug.current == $slug && publishStatus == "published"][0] { 
    title, 
    summary, 
    tags, 
    "thumbnailUrl": thumbnail.asset->url 
  }`;
  
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
      // 🌟 修正點：確保傳給 url 的是純字串網址
      images: post.thumbnailUrl ? [{ url: post.thumbnailUrl }] : [],
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}