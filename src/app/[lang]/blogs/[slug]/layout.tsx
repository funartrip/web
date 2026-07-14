import { client } from '@/sanity/lib/client';
import { Metadata } from 'next';

// 🌐 1. 伺服器端獨立運作的 Blog SEO 引擎 (Next.js 規定只能在 Server 運作)
export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
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

// 🌟 2. 補上 Vercel 報錯缺少的「預設導出組件」，單純做個外殼把文章內容 (children) 傳下去渲染
export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}