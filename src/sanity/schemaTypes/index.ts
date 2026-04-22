// 1. 匯入基礎的多語系「小包包」零件
import { localeString } from './localeString'
import { localeBlock } from './localeBlock'
import localeText from './localeText'
// 2. 匯入你網站的各個功能「房間」藍圖
import { category } from './category'
import { tour } from './tour'
import { portfolio } from './portfolio'
import { blogPost } from './blogPost'
import { priceOption } from './priceOption'
import { bookingTerms } from './bookingTerms'
import  aboutPage  from './about-page'
import localeBlockContent from './localeBlockContent'
import portfolioPage from './portfolioPage'
import blogPostPage from './blogPostPage'
import tourPage from './tourPage'
import legalPage from './legalPage'
import { stop } from './stop'

export const schemaTypes = [
  // ... 其他的
  priceOption, // 登記後，後台就會出現「Price Templates」這一欄
  localeString,
  localeBlock,
  localeText,
  localeBlockContent,
  
  // 再放你的功能資料表
  category,
  aboutPage,
  tour,
  stop,
  portfolio,
  blogPost,
  bookingTerms,
  portfolioPage,
  blogPostPage,
  tourPage,
  legalPage,
]