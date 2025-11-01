// src/locales/index.js

import Home from "../components/frontend/home.vue"
export const translations = {
  ar: {
    // الهيدر
    header: {
      logoAlt: 'شعار منصة الدعم النفسي',
      joinUs: 'انضم إلينا',
      languageToggle: 'تبديل اللغة',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      arrowAlt: 'سهم الانضمام'
    },
    
    // القائمة
    menuItems: {
      Home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      specialists: 'الأخصائيون',
      sessions: 'جلسات الدعم',
      events: 'الفعاليات والورش',
      measures: 'المقاييس',
      testimonials: 'شهادات المستفيدين',
      articles: 'المقالات والتوعية',
      library: 'المكتبة',
      faq: 'الأسئلة الشائعة',
      contact: 'اتصل بنا'
    },

    // صفحة الفعاليات
    events: {
      // الهيرو
      hero: {
        title: 'فعاليات الصحة',
        highlight: 'النفسية',
        subtitle: 'انضم إلى رحلتنا التفاعلية لاكتساب المعرفة وتبادل الخبرات في مجال الصحة النفسية',
        buttons: {
          exploreEvents: 'استكشف الفعاليات',
          learnMore: 'المزيد عنا',
          startJourney: 'ابدأ الرحلة'
        }
      },

      // الفلترة والبحث
      filter: {
        searchPlaceholder: 'ابحث في الفعاليات والورش...',
        allEvents: 'جميع الفعاليات',
        evenings: 'الأمسيات',
        events: 'الفعاليات',
        workshops: 'ورش العمل'
      },

      // قائمة الفعاليات
      list: {
        noResults: {
          title: 'لا توجد نتائج',
          message: 'لم نتمكن من العثور على فعاليات تطابق بحثك'
        },
        pagination: {
          previous: 'السابق',
          next: 'التالي',
          showing: 'عرض {from} - {to} من أصل {total} فعالية'
        },
        readMore: 'اقرأ المزيد'
      },

      // تفاصيل الفعالية
      details: {
        breadcrumb: {
          home: 'الرئيسية',
          events: 'الفعاليات'
        },
        eventInfo: {
          dateTime: 'التاريخ والوقت',
          location: 'الموقع',
          duration: 'المدة'
        },
        sections: {
          overview: 'نبذة عن الفعالية',
          topics: 'المواضيع المغطاة',
          related: 'فعاليات ذات صلة'
        },
        noRelated: {
          title: 'لا توجد فعاليات ذات صلة',
          message: 'لم نتمكن من العثور على فعاليات مشابهة'
        }
      },

      // أنواع الفعاليات
      types: {
        evenings: 'أمسيات',
        events: 'فعاليات',
        workshops: 'ورش عمل'
      }
    },

    // أزرار عامة
    buttons: {
      close: 'إغلاق',
      register: 'سجل الآن',
      back: 'رجوع',
      explore: 'استكشف'
    },

    // معلومات عامة
    general: {
      author: 'فريق الدعم النفسي',
      noResults: 'لا توجد نتائج',
      search: 'بحث',
      filter: 'تصفية',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'الموقع',
      duration: 'المدة'
    },
     // صفحة من نحن
    about: {
      // الهيرو
      hero: {
        title: "من ",
        highlight: "نحن",
        subtitle: "نحن نعمل على تمكين المجتمع وتقديم برامج دعم نفسي واجتماعي ذات تأثير حقيقي.",
        buttons: {
          startJourney: "ابدأ الرحلة",
          learnMore: "المزيد عنا"
        }
      },

      // النظرة العامة
      overview: {
        title: "مركز الدراسات الاستراتيجية لدعم المرأة والطفل",
        description1: "مركز الدراسات الاستراتيجية لدعم المرأة والطفل - اليمن هو مؤسسة مدنية مستقلة غير ربحية يتمتع بشخصية قانونية مستقلة. تأسس وفق قانون الجمعيات والمؤسسات الأهلية رقم (1) لسنة 2001م ولائحته التنفيذية في 20/12/2018 بموجب ترخيص مكتب وزارة الشئون الاجتماعية والعمل رقم (80/ م) ومقره الرئيسي محافظة تعز.",
        description2: "ويهدف إلى دعم المرأة والطفل بشكل خاص والفئات الضعيفة والمهمشة على وجه العموم من خلال الدراسات والأبحاث المتخصصة والمساهمة في تطوير الاستراتيجيات والسياسات والرؤى الخاصة بتمكين وتحسين أوضاع المرأة والطفل وكافة الفئات الضعيفة والمهمشة وحمايتهم من العنف والتمييز.",
        description3: "وكذلك يعمل من خلال المشاريع والبرامج والأنشطة الموجهة لحماية الحقوق والحريات وتعزيز الديمقراطية والحكم الرشيد وبناء السلام والأمن والتنمية، ودعم الهياكل الرسمية وغير الرسمية التي تعني بحماية ورعاية النساء المعنفات والأطفال الجانحين.",
        description4: "ويتفاعل المركز مع كافة الأطراف المدنية المحلية والإقليمية والدولية من خلال التنسيق والشراكات التي تساهم في تحقيق أهداف المركز.",
        badges: {
          independent: "مؤسسة مستقلة",
          nonProfit: "غير ربحي",
          licensed: "مرخص رسمياً"
        }
      },

      // الرؤية والرسالة
      visionMission: {
        title: "رؤيتنا ورسالتنا",
        subtitle: "نسعى لتحقيق التميز في دعم المرأة والطفل والفئات الضعيفة في اليمن",
        vision: {
          title: "رؤيتنا",
          description: "أن نكون في طليعة المجتمع المدني المتخصص في صناعة مستقبل أفضل للنساء والأطفال والفئات الضعيفة في اليمن"
        },
        mission: {
          title: "رسالتنا",
          description: "نسعى الى دعم ومساندة المرأة والطفل والفئات الضعيفة والمهمشة من خلال تعزيز قيم المشاركة والحماية والأمن والسلم المجتمعي، وفق رؤى واستراتيجيات ممنهجة من خلال الخبرات والكفاءات المتخصصة للوقاية والحد من آثار العنف والانتهاكات وصولا الى إرساء قيم العدالة والانصاف وسيادة القانون."
        },
        values: {
          title: "قيمنا",
          items: [
            "العدالة والإنصاف",
            "الحماية والأمن",
            "المشاركة المجتمعية",
            "الشفافية والنزاهة"
          ]
        }
      },

      // الأهداف
      objectives: {
        title: "أهدافنا وغاياتنا",
        subtitle: "نسعى لتحقيق أهداف طموحة تساهم في دعم وحماية المرأة والطفل والفئات المهمشة في اليمن",
        items: [
          "المساهمة في تعزيز الوعي المجتمعي حول قضايا المرأة والطفل في اليمن من خلال البرامج والأنشطة واللقاءات والمطبوعات الموجهة",
          "المساهمة في دعم المشاركة السياسية والاقتصادية والاجتماعية والثقافية للنساء",
          "العمل على تعزيز طرق الحماية للنساء والاطفال من خلال دعم مراكز الرعاية والحماية للنساء المعنفات والاطفال الجانحين",
          "المساهمة في وضع رؤى واستراتيجيات متخصصة تساهم في معالجة التحديات التي تعيق تمكين النساء والأطفال من المشاركة الفعالة وترتقي بوضعهم للأفضل",
          "العمل على تعزيز قدرات ومهارات النساء من خلال برامج تدريبية نوعية تمكنها من الانخراط في عملية التنمية والسلام والأمن بفاعلية",
          "المساهمة في تطوير استراتيجيات مواجهة الازمات التي تؤثر على النساء والأطفال من خلال الدراسات والأبحاث والبرامج التي ينفذها المركز",
          "تعزيز مبادئ وقيم حقوق الإنسان والعدالة والحكم الرشيد من خلال التقارير المتخصصة والبرامج والفعاليات الموجهة لمراقبة ومتابعة حالة حقوق الانسان واليات الحماية المحلية والعدالة الانتقالية والحكم الرشيد",
          "العمل على تفعيل وتطوير اليات الشراكة والتنسيق مع الجهات الرسمية والمجتمع المدني المحلى والإقليمي والدولي والاعلام والمانحين بما لا يتعارض مع أهداف المركز والقوانين النافذة"
        ]
      },

      // الإحصائيات
      statistics: {
        title: "إنجازاتنا وأرقامنا",
        subtitle: "نحن نفخر بما حققناه من إنجازات ونعمل دائمًا على التطوير والتحسين",
        items: {
          sessions: "جلسة استشارية",
          workshops: "ورشة تدريبية",
          satisfaction: "رضا العملاء",
          specialists: "أخصائي معتمد"
        }
      },

      // آراء العملاء
      testimonials: {
        title: "ماذا يقول عملاؤنا",
        subtitle: "آراء وتقييمات من مستفيدين حقيقيين من خدماتنا"
      }
    },

  },

  en: {
    // Header
    header: {
      logoAlt: 'Mental Health Support Platform Logo',
      joinUs: 'Join Us',
      languageToggle: 'Toggle Language',
      openMenu: 'Open Menu',
      closeMenu: 'Close Menu',
      arrowAlt: 'Join arrow'
    },
    
    // Menu
    menuItems: {
      Home: 'Home',
      about: 'About Us',
      services: 'Our Services',
      specialists: 'Specialists',
      sessions: 'Support Sessions',
      events: 'Events & Workshops',
      measures: 'Measurements',
      testimonials: 'Testimonials',
      articles: 'Articles & Awareness',
      library: 'Library',
      faq: 'FAQ',
      contact: 'Contact Us'
    },

    // Events Page
    events: {
      // Hero
      hero: {
        title: 'Mental Health',
        highlight: 'Events',
        subtitle: 'Join our interactive journey to gain knowledge and exchange experiences in mental health',
        buttons: {
          exploreEvents: 'Explore Events',
          learnMore: 'Learn More',
          startJourney: 'Start Journey'
        }
      },

      // Filter and Search
      filter: {
        searchPlaceholder: 'Search events and workshops...',
        allEvents: 'All Events',
        evenings: 'Evenings',
        events: 'Events',
        workshops: 'Workshops'
      },

      // Events List
      list: {
        noResults: {
          title: 'No Results',
          message: 'We couldn\'t find any events matching your search'
        },
        pagination: {
          previous: 'Previous',
          next: 'Next',
          showing: 'Showing {from} - {to} of {total} events'
        },
        readMore: 'Read More'
      },

      // Event Details
      details: {
        breadcrumb: {
          home: 'Home',
          events: 'Events'
        },
        eventInfo: {
          dateTime: 'Date & Time',
          location: 'Location',
          duration: 'Duration'
        },
        sections: {
          overview: 'Event Overview',
          topics: 'Covered Topics',
          related: 'Related Events'
        },
        noRelated: {
          title: 'No Related Events',
          message: 'We couldn\'t find similar events'
        }
      },

      // Event Types
      types: {
        evenings: 'Evenings',
        events: 'Events',
        workshops: 'Workshops'
      }
    },

    // General Buttons
    buttons: {
      close: 'Close',
      register: 'Register Now',
      back: 'Back',
      explore: 'Explore'
    },

    // General Information
    general: {
      author: 'Mental Health Team',
      noResults: 'No Results',
      search: 'Search',
      filter: 'Filter',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      duration: 'Duration'
    },
    about: {
      // Hero
      hero: {
        title: "About ",
        highlight: "Us",
        subtitle: "We work to empower society and provide psychological and social support programs with real impact.",
        buttons: {
          startJourney: "Start Journey",
          learnMore: "Learn More"
        }
      },

      // Overview
      overview: {
        title: "Strategic Studies Center for Women and Children Support",
        description1: "The Strategic Studies Center for Women and Children Support - Yemen is an independent non-profit civil institution with independent legal personality. It was established according to the Associations and Civil Institutions Law No. (1) of 2001 and its executive regulations on 20/12/2018 under license No. (80/M) from the Ministry of Social Affairs and Labor office, with its main headquarters in Taiz Governorate.",
        description2: "It aims to support women and children in particular and vulnerable and marginalized groups in general through specialized studies and research, and to contribute to developing strategies, policies, and visions for empowering and improving the conditions of women, children, and all vulnerable and marginalized groups, and protecting them from violence and discrimination.",
        description3: "It also works through projects, programs, and activities aimed at protecting rights and freedoms, promoting democracy, good governance, peacebuilding, security, and development, and supporting formal and informal structures concerned with protecting and caring for abused women and delinquent children.",
        description4: "The center interacts with all local, regional, and international civil parties through coordination and partnerships that contribute to achieving the center's goals.",
        badges: {
          independent: "Independent Institution",
          nonProfit: "Non-Profit",
          licensed: "Officially Licensed"
        }
      },

      // Vision & Mission
      visionMission: {
        title: "Our Vision & Mission",
        subtitle: "We strive for excellence in supporting women, children, and vulnerable groups in Yemen",
        vision: {
          title: "Our Vision",
          description: "To be at the forefront of civil society specialized in creating a better future for women, children, and vulnerable groups in Yemen"
        },
        mission: {
          title: "Our Mission",
          description: "We seek to support and assist women, children, and vulnerable and marginalized groups by promoting values of participation, protection, security, and community peace, through systematic visions and strategies using specialized expertise and competencies to prevent and reduce the effects of violence and violations, leading to the establishment of justice, fairness, and the rule of law."
        },
        values: {
          title: "Our Values",
          items: [
            "Justice and Fairness",
            "Protection and Security",
            "Community Participation",
            "Transparency and Integrity"
          ]
        }
      },

      // Objectives
      objectives: {
        title: "Our Objectives & Goals",
        subtitle: "We strive to achieve ambitious goals that contribute to supporting and protecting women, children, and marginalized groups in Yemen",
        items: [
          "Contribute to enhancing community awareness about women and children's issues in Yemen through targeted programs, activities, meetings, and publications",
          "Contribute to supporting women's political, economic, social, and cultural participation",
          "Work to enhance protection methods for women and children by supporting care and protection centers for abused women and delinquent children",
          "Contribute to developing specialized visions and strategies that help address challenges hindering women and children from effective participation and improve their conditions",
          "Work to enhance women's capacities and skills through quality training programs that enable them to effectively engage in development, peace, and security processes",
          "Contribute to developing crisis response strategies affecting women and children through studies, research, and programs implemented by the center",
          "Promote human rights principles and values, justice, and good governance through specialized reports, programs, and events aimed at monitoring and following up on human rights conditions, local protection mechanisms, transitional justice, and good governance",
          "Work to activate and develop partnership and coordination mechanisms with official authorities, local, regional, and international civil society, media, and donors in a way that does not conflict with the center's goals and applicable laws"
        ]
      },

      // Statistics
      statistics: {
        title: "Our Achievements & Numbers",
        subtitle: "We are proud of our achievements and always work on development and improvement",
        items: {
          sessions: "Consultation Sessions",
          workshops: "Training Workshops",
          satisfaction: "Client Satisfaction",
          specialists: "Certified Specialists"
        }
      },

      // Testimonials
      testimonials: {
        title: "What Our Clients Say",
        subtitle: "Opinions and reviews from real beneficiaries of our services"
      }
    },

  }
}

// دالة مساعدة للحصول على الترجمة
export function t(key, language = 'ar', params = {}) {
  const keys = key.split('.')
  let value = translations[language]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
  }
  
  // استبدال المعاملات إذا وجدت
  if (typeof value === 'string' && params) {
    Object.keys(params).forEach(param => {
      value = value.replace(`{${param}}`, params[param])
    })
  }
  
  return value || key
}