// src/sanity/lib/queries.ts

// 1. 抓取所有作品清單 (列表頁用)
export const portfoliosQuery = `*[_type == "portfolio"] | order(date desc) {
  _id,
  nameProject,
  "slug": slug.current,
  displayTitle,
  subtitle,
  projectCover,
  date,
  "type": type[]->{ name }, 
  "targetAudience": targetAudience[]->{ name }
}`;

// 2. 抓取單一作品詳細內容 (詳情頁用)
export const projectQuery = `*[_type == "portfolio" && slug.current == $slug][0] {
  ...,
  "type": type[]->{ name },
  "targetAudience": targetAudience[]->{ name }
}`;