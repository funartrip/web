import { client } from '@/sanity/lib/client';
import { Metadata } from 'next';

// 🌐 伺服器端獨立運作的 Portfolio SEO 引擎
export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang || 'zh_tw').toLowerCase().replace('-', '_');

  const query = `*[_type == "portfolio" && slug.current == $slug && publishStatus == "published"][0] { 
    displayTitle, 
    subtitle, 
    seoKeywords, 
    "projectCoverUrl": projectCover.asset->url
  }`;
  const project = await client.fetch(query, { slug: resolvedParams.slug });

  if (!project) return {};

  const getLabel = (field: any, l: string) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[l] || field[l.replace('_', '-')] || field['zh_tw'] || Object.values(field).find(v => v) || '';
  };

  const pageTitle = getLabel(project.displayTitle, lang);
  const pageDesc = getLabel(project.subtitle, lang);
  const rawKeywords = project.seoKeywords || '';

  const defaultKeywords = ['Fun ArTrip', '楓藝', '跨界合作專案', '文化中介'];
  const customKeywords = rawKeywords.split(',').map((k: string) => k.trim()).filter(Boolean);
  const finalKeywords = [...customKeywords, ...defaultKeywords];

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: finalKeywords,
    openGraph: {
      title: `${pageTitle} | Fun ArTrip 楓藝`,
      description: pageDesc,
      images: project.projectCoverUrl ? [{ url: project.projectCoverUrl }] : [],
    },
  };
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}