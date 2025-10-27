// src/locales/index.js

export const translations = {
  ar: {
    header: {
      logoAlt: 'شعار منصة الدعم النفسي',
      arrowAlt: 'سهم',
      joinUs: 'انضم إلينا',
      languageToggle: 'تبديل اللغة',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة'
    },
    menuItems: {
      about: 'من نحن',
      services: 'خدماتنا',
      specialists: 'الأخصائيون',
      sessions: 'جلسات الدعم',
      events: 'الفعاليات والورش',
      measures: 'المقاييس',
      testimonials: 'شهادات المستفيدين',
      articles: 'المقالات والتوعية',
      faq: 'الأسئلة الشائعة',
      contact: 'اتصل بنا'
    }
  },
  en: {
    header: {
      logoAlt: 'Mental Health Support Platform Logo',
      arrowAlt: 'Arrow',
      joinUs: 'Join Us',
      languageToggle: 'Toggle Language',
      openMenu: 'Open Menu',
      closeMenu: 'Close Menu'
    },
    menuItems: {
      about: 'About Us',
      services: 'Our Services',
      specialists: 'Specialists',
      sessions: 'Support Sessions',
      events: 'Events & Workshops',
      measures: 'Measurements',
      testimonials: 'Testimonials',
      articles: 'Articles & Awareness',
      faq: 'FAQ',
      contact: 'Contact Us'
    }
  }
}

// Helper function to get translation
export function t(key, language = 'ar') {
  const keys = key.split('.')
  let value = translations[language]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  return value || key
}