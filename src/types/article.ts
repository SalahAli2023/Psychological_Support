export interface ArticleCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  color?: string;
  description_ar?: string;
  description_en?: string;
}

export interface Article {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  introduction_ar?: string;
  introduction_en?: string;
  image?: string;
  category_id: string;
  category?: ArticleCategory;
  author_id: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  attachments?: string[];
  published_at: string;
  is_published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleFormData {
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  introduction_ar: string;
  introduction_en: string;
  category_id: string;
  image?: File | null;
  published_at: string;
  is_published: boolean;
  attachments: string[];
}