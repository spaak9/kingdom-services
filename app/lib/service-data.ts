export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.s-baak.com";

export const WHATSAPP_NUMBER = "966598863130";

export type ServiceSlug =
  | "plumbing"
  | "electricity"
  | "painting"
  | "ceramic";


export type ServiceInfo = {
  slug: ServiceSlug;
  name: string;
  searchName: string;
  pluralName: string;
  intro: string;
  details: string[];
  faq: {
    question: string;
    answer: string;
  }[];
};


export const services: Record<ServiceSlug, ServiceInfo> = {
  plumbing: {
    slug: "plumbing",
    name: "السباكة",
    searchName: "سباك",
    pluralName: "خدمات السباكة",
    intro:
      "خدمات سباكة منزلية تشمل فحص التسريبات وصيانة التمديدات والأدوات الصحية ومعالجة الأعطال الشائعة.",
    details: [
      "فحص ومعالجة تسريبات المياه داخل المنزل.",
      "صيانة وتمديد مواسير المياه والصرف.",
      "تركيب وصيانة الخلاطات والمغاسل ودورات المياه.",
      "معالجة الانسدادات والأعطال المنزلية المرتبطة بالسباكة.",
    ],
    faq: [
      {
        question: "ما الخدمات التي يقدمها سباك المنزل؟",
        answer:
          "قد تشمل الخدمة فحص التسريبات، إصلاح التمديدات، صيانة الأدوات الصحية، معالجة الانسدادات وتركيب القطع المنزلية المرتبطة بالمياه والصرف.",
      },
      {
        question: "هل يمكن طلب سباك لمعالجة تسريب داخل المنزل؟",
        answer:
          "نعم، تعرض الصفحة خدمات سباكة متاحة في المدينة مع بيانات التواصل للوصول إلى مقدم الخدمة المناسب.",
      },
    ],
  },
  electricity: {
    slug: "electricity",
    name: "الكهرباء",
    searchName: "كهربائي",
    pluralName: "خدمات الكهرباء",
    intro:
      "خدمات كهربائية منزلية تشمل فحص الأعطال وصيانة المفاتيح والأفياش والإنارة والتركيبات الكهربائية.",
    details: [
      "فحص الأعطال الكهربائية المنزلية.",
      "صيانة المفاتيح والأفياش واللوحات.",
      "تركيب وحدات الإنارة والأجهزة المرتبطة بالكهرباء.",
      "معالجة المشكلات الكهربائية المنزلية الشائعة.",
    ],
    faq: [
      {
        question: "ما الأعمال التي يقدمها كهربائي المنزل؟",
        answer:
          "قد تشمل فحص الأعطال، صيانة المفاتيح والأفياش والإنارة واللوحات وتنفيذ التركيبات الكهربائية المنزلية.",
      },
      {
        question: "هل الصفحة خاصة بخدمات الكهرباء في هذه المدينة؟",
        answer:
          "نعم، كل صفحة مخصصة لخدمة ومدينة محددتين حتى تكون المعلومات والعنوان واضحين للزائر ولمحركات البحث.",
      },
    ],
  },
  painting: {
    slug: "painting",
    name: "صباغ",
    searchName: "صباغ",
    pluralName: "خدمات الصباغة",
    intro:
      "خدمات دهان وتشطيب للمنازل تشمل الدهانات الداخلية والخارجية وتجديد الجدران وتحسين المظهر العام.",
    details: [
      "دهانات داخلية للغرف والصالات.",
      "دهانات خارجية وواجهات حسب نوع الموقع.",
      "تجهيز الجدران ومعالجة العيوب قبل الدهان.",
      "تجديد الألوان والتشطيبات المنزلية.",
    ],
    faq: [
      {
        question: "ما الخدمات التي يقدمها الدهان؟",
        answer:
          "تشمل الخدمات عادة تجهيز الجدران والدهانات الداخلية والخارجية وتجديد الألوان وأعمال التشطيب المرتبطة بها.",
      },
      {
        question: "هل يمكن العثور على دهان في مدينتي؟",
        answer:
          "تعرض هذه الصفحة خدمة الدهان للمدينة المحددة مع معلومات واضحة ووسيلة تواصل مباشرة.",
      },
    ],
  },
  ceramic: {
    slug: "ceramic",
    name: "مبلط",
    searchName: "مبلط",
    pluralName: "خدمات التبليط",
    intro:
      "خدمات تركيب وصيانة السيراميك والبورسلان للمنازل، بما يشمل الأرضيات والجدران وأعمال الترميم.",
    details: [
      "تركيب السيراميك والبورسلان للأرضيات.",
      "تركيب بلاط الجدران للمطابخ ودورات المياه.",
      "إزالة واستبدال القطع المتضررة.",
      "أعمال الترميم والتشطيب المرتبطة بالسيراميك.",
    ],
    faq: [
      {
        question: "ما الأعمال التي يقدمها معلم السيراميك؟",
        answer:
          "قد تشمل تركيب السيراميك والبورسلان للأرضيات والجدران واستبدال القطع المتضررة وتنفيذ أعمال الترميم.",
      },
      {
        question: "هل الصفحة مخصصة لتركيب السيراميك في المدينة؟",
        answer:
          "نعم، عنوان الصفحة ومحتواها مخصصان لخدمة السيراميك في المدينة المحددة.",
      },
    ],
  },
};

export const cities = {
  "riyadh": {
    slug: "riyadh",
    name: "الرياض",
    region: "المنطقة الوسطى",
  },
  "diriyah": {
    slug: "diriyah",
    name: "الدرعية",
    region: "المنطقة الوسطى",
  },
  "al-kharj": {
    slug: "al-kharj",
    name: "الخرج",
    region: "المنطقة الوسطى",
  },
  "ad-dilam": {
    slug: "ad-dilam",
    name: "الدلم",
    region: "المنطقة الوسطى",
  },
  "ad-dawadmi": {
    slug: "ad-dawadmi",
    name: "الدوادمي",
    region: "المنطقة الوسطى",
  },
  "al-majmaah": {
    slug: "al-majmaah",
    name: "المجمعة",
    region: "المنطقة الوسطى",
  },
  "al-quwayiyah": {
    slug: "al-quwayiyah",
    name: "القويعية",
    region: "المنطقة الوسطى",
  },
  "al-aflaj": {
    slug: "al-aflaj",
    name: "الأفلاج",
    region: "المنطقة الوسطى",
  },
  "wadi-ad-dawasir": {
    slug: "wadi-ad-dawasir",
    name: "وادي الدواسر",
    region: "المنطقة الوسطى",
  },
  "al-zulfi": {
    slug: "al-zulfi",
    name: "الزلفي",
    region: "المنطقة الوسطى",
  },
  "shaqra": {
    slug: "shaqra",
    name: "شقراء",
    region: "المنطقة الوسطى",
  },
  "hotat-bani-tamim": {
    slug: "hotat-bani-tamim",
    name: "حوطة بني تميم",
    region: "المنطقة الوسطى",
  },
  "afif": {
    slug: "afif",
    name: "عفيف",
    region: "المنطقة الوسطى",
  },
  "al-ghat": {
    slug: "al-ghat",
    name: "الغاط",
    region: "المنطقة الوسطى",
  },
  "as-sulayyil": {
    slug: "as-sulayyil",
    name: "السليل",
    region: "المنطقة الوسطى",
  },
  "dhurma": {
    slug: "dhurma",
    name: "ضرما",
    region: "المنطقة الوسطى",
  },
  "al-muzahimiyah": {
    slug: "al-muzahimiyah",
    name: "المزاحمية",
    region: "المنطقة الوسطى",
  },
  "rumah": {
    slug: "rumah",
    name: "رماح",
    region: "المنطقة الوسطى",
  },
  "thadiq": {
    slug: "thadiq",
    name: "ثادق",
    region: "المنطقة الوسطى",
  },
  "huraymila": {
    slug: "huraymila",
    name: "حريملاء",
    region: "المنطقة الوسطى",
  },
  "al-hariq": {
    slug: "al-hariq",
    name: "الحريق",
    region: "المنطقة الوسطى",
  },
  "marrat": {
    slug: "marrat",
    name: "مرات",
    region: "المنطقة الوسطى",
  },
  "ar-rayn": {
    slug: "ar-rayn",
    name: "الرين",
    region: "المنطقة الوسطى",
  },
  "buraydah": {
    slug: "buraydah",
    name: "بريدة",
    region: "المنطقة الوسطى",
  },
  "unaizah": {
    slug: "unaizah",
    name: "عنيزة",
    region: "المنطقة الوسطى",
  },
  "ar-rass": {
    slug: "ar-rass",
    name: "الرس",
    region: "المنطقة الوسطى",
  },
  "al-mithnab": {
    slug: "al-mithnab",
    name: "المذنب",
    region: "المنطقة الوسطى",
  },
  "al-bukayriyah": {
    slug: "al-bukayriyah",
    name: "البكيرية",
    region: "المنطقة الوسطى",
  },
  "al-badaea": {
    slug: "al-badaea",
    name: "البدائع",
    region: "المنطقة الوسطى",
  },
  "al-asyah": {
    slug: "al-asyah",
    name: "الأسياح",
    region: "المنطقة الوسطى",
  },
  "an-nabhaniyah": {
    slug: "an-nabhaniyah",
    name: "النبهانية",
    region: "المنطقة الوسطى",
  },
  "ash-shimasiyah": {
    slug: "ash-shimasiyah",
    name: "الشماسية",
    region: "المنطقة الوسطى",
  },
  "uyun-al-jawa": {
    slug: "uyun-al-jawa",
    name: "عيون الجواء",
    region: "المنطقة الوسطى",
  },
  "riyadh-al-khabra": {
    slug: "riyadh-al-khabra",
    name: "رياض الخبراء",
    region: "المنطقة الوسطى",
  },
  "uqlat-as-suqur": {
    slug: "uqlat-as-suqur",
    name: "عقلة الصقور",
    region: "المنطقة الوسطى",
  },
  "dariyah": {
    slug: "dariyah",
    name: "ضرية",
    region: "المنطقة الوسطى",
  },
  "abanat": {
    slug: "abanat",
    name: "أبانات",
    region: "المنطقة الوسطى",
  },
  "dammam": {
    slug: "dammam",
    name: "الدمام",
    region: "المنطقة الشرقية",
  },
  "khobar": {
    slug: "khobar",
    name: "الخبر",
    region: "المنطقة الشرقية",
  },
  "dhahran": {
    slug: "dhahran",
    name: "الظهران",
    region: "المنطقة الشرقية",
  },
  "al-ahsa": {
    slug: "al-ahsa",
    name: "الأحساء",
    region: "المنطقة الشرقية",
  },
  "hofuf": {
    slug: "hofuf",
    name: "الهفوف",
    region: "المنطقة الشرقية",
  },
  "al-mubarraz": {
    slug: "al-mubarraz",
    name: "المبرز",
    region: "المنطقة الشرقية",
  },
  "hafar-al-batin": {
    slug: "hafar-al-batin",
    name: "حفر الباطن",
    region: "المنطقة الشرقية",
  },
  "jubail": {
    slug: "jubail",
    name: "الجبيل",
    region: "المنطقة الشرقية",
  },
  "qatif": {
    slug: "qatif",
    name: "القطيف",
    region: "المنطقة الشرقية",
  },
  "saihat": {
    slug: "saihat",
    name: "سيهات",
    region: "المنطقة الشرقية",
  },
  "safwa": {
    slug: "safwa",
    name: "صفوى",
    region: "المنطقة الشرقية",
  },
  "ras-tanura": {
    slug: "ras-tanura",
    name: "رأس تنورة",
    region: "المنطقة الشرقية",
  },
  "abqaiq": {
    slug: "abqaiq",
    name: "بقيق",
    region: "المنطقة الشرقية",
  },
  "khafji": {
    slug: "khafji",
    name: "الخفجي",
    region: "المنطقة الشرقية",
  },
  "an-nuayriyah": {
    slug: "an-nuayriyah",
    name: "النعيرية",
    region: "المنطقة الشرقية",
  },
  "qaryat-al-ulya": {
    slug: "qaryat-al-ulya",
    name: "قرية العليا",
    region: "المنطقة الشرقية",
  },
  "al-udayd": {
    slug: "al-udayd",
    name: "العديد",
    region: "المنطقة الشرقية",
  },
  "al-bayda": {
    slug: "al-bayda",
    name: "البيضاء",
    region: "المنطقة الشرقية",
  },
  "makkah": {
    slug: "makkah",
    name: "مكة",
    region: "المنطقة الغربية",
  },
  "jeddah": {
    slug: "jeddah",
    name: "جدة",
    region: "المنطقة الغربية",
  },
  "taif": {
    slug: "taif",
    name: "الطائف",
    region: "المنطقة الغربية",
  },
  "al-qunfudhah": {
    slug: "al-qunfudhah",
    name: "القنفذة",
    region: "المنطقة الغربية",
  },
  "al-lith": {
    slug: "al-lith",
    name: "الليث",
    region: "المنطقة الغربية",
  },
  "rabigh": {
    slug: "rabigh",
    name: "رابغ",
    region: "المنطقة الغربية",
  },
  "khulays": {
    slug: "khulays",
    name: "خليص",
    region: "المنطقة الغربية",
  },
  "al-khurmah": {
    slug: "al-khurmah",
    name: "الخرمة",
    region: "المنطقة الغربية",
  },
  "ranyah": {
    slug: "ranyah",
    name: "رنية",
    region: "المنطقة الغربية",
  },
  "turbah": {
    slug: "turbah",
    name: "تربة",
    region: "المنطقة الغربية",
  },
  "al-jumum": {
    slug: "al-jumum",
    name: "الجموم",
    region: "المنطقة الغربية",
  },
  "al-kamil": {
    slug: "al-kamil",
    name: "الكامل",
    region: "المنطقة الغربية",
  },
  "al-muwayh": {
    slug: "al-muwayh",
    name: "المويه",
    region: "المنطقة الغربية",
  },
  "maysan": {
    slug: "maysan",
    name: "ميسان",
    region: "المنطقة الغربية",
  },
  "adham": {
    slug: "adham",
    name: "أضم",
    region: "المنطقة الغربية",
  },
  "al-ardiyat": {
    slug: "al-ardiyat",
    name: "العرضيات",
    region: "المنطقة الغربية",
  },
  "bahrah": {
    slug: "bahrah",
    name: "بحرة",
    region: "المنطقة الغربية",
  },
  "madinah": {
    slug: "madinah",
    name: "المدينة المنورة",
    region: "المنطقة الغربية",
  },
  "yanbu": {
    slug: "yanbu",
    name: "ينبع",
    region: "المنطقة الغربية",
  },
  "al-ula": {
    slug: "al-ula",
    name: "العلا",
    region: "المنطقة الغربية",
  },
  "mahd-adh-dhahab": {
    slug: "mahd-adh-dhahab",
    name: "المهد",
    region: "المنطقة الغربية",
  },
  "al-hanakiyah": {
    slug: "al-hanakiyah",
    name: "الحناكية",
    region: "المنطقة الغربية",
  },
  "wadi-al-fara": {
    slug: "wadi-al-fara",
    name: "وادي الفرع",
    region: "المنطقة الغربية",
  },
  "al-ais": {
    slug: "al-ais",
    name: "العيص",
    region: "المنطقة الغربية",
  },
  "khaybar": {
    slug: "khaybar",
    name: "خيبر",
    region: "المنطقة الغربية",
  },
  "badr": {
    slug: "badr",
    name: "بدر",
    region: "المنطقة الغربية",
  },
  "tabuk": {
    slug: "tabuk",
    name: "تبوك",
    region: "المنطقة الشمالية",
  },
  "al-wajh": {
    slug: "al-wajh",
    name: "الوجه",
    region: "المنطقة الشمالية",
  },
  "duba": {
    slug: "duba",
    name: "ضباء",
    region: "المنطقة الشمالية",
  },
  "tayma": {
    slug: "tayma",
    name: "تيماء",
    region: "المنطقة الشمالية",
  },
  "umluj": {
    slug: "umluj",
    name: "أملج",
    region: "المنطقة الشمالية",
  },
  "haql": {
    slug: "haql",
    name: "حقل",
    region: "المنطقة الشمالية",
  },
  "al-bad": {
    slug: "al-bad",
    name: "البدع",
    region: "المنطقة الشمالية",
  },
  "hail": {
    slug: "hail",
    name: "حائل",
    region: "المنطقة الشمالية",
  },
  "baqaa": {
    slug: "baqaa",
    name: "بقعاء",
    region: "المنطقة الشمالية",
  },
  "al-hait": {
    slug: "al-hait",
    name: "الحائط",
    region: "المنطقة الشمالية",
  },
  "al-ghazalah": {
    slug: "al-ghazalah",
    name: "الغزالة",
    region: "المنطقة الشمالية",
  },
  "ash-shinan": {
    slug: "ash-shinan",
    name: "الشنان",
    region: "المنطقة الشمالية",
  },
  "as-sulaymi": {
    slug: "as-sulaymi",
    name: "السليمي",
    region: "المنطقة الشمالية",
  },
  "ash-shamli": {
    slug: "ash-shamli",
    name: "الشملي",
    region: "المنطقة الشمالية",
  },
  "mawqaq": {
    slug: "mawqaq",
    name: "موقق",
    region: "المنطقة الشمالية",
  },
  "sumaira": {
    slug: "sumaira",
    name: "سميراء",
    region: "المنطقة الشمالية",
  },
  "arar": {
    slug: "arar",
    name: "عرعر",
    region: "المنطقة الشمالية",
  },
  "rafha": {
    slug: "rafha",
    name: "رفحاء",
    region: "المنطقة الشمالية",
  },
  "turaif": {
    slug: "turaif",
    name: "طريف",
    region: "المنطقة الشمالية",
  },
  "al-uwayqilah": {
    slug: "al-uwayqilah",
    name: "العويقيلة",
    region: "المنطقة الشمالية",
  },
  "sakaka": {
    slug: "sakaka",
    name: "سكاكا",
    region: "المنطقة الشمالية",
  },
  "al-qurayyat": {
    slug: "al-qurayyat",
    name: "القريات",
    region: "المنطقة الشمالية",
  },
  "dumat-al-jandal": {
    slug: "dumat-al-jandal",
    name: "دومة الجندل",
    region: "المنطقة الشمالية",
  },
  "tabarjal": {
    slug: "tabarjal",
    name: "طبرجل",
    region: "المنطقة الشمالية",
  },
  "suwayr": {
    slug: "suwayr",
    name: "صوير",
    region: "المنطقة الشمالية",
  },
  "abha": {
    slug: "abha",
    name: "أبها",
    region: "المنطقة الجنوبية",
  },
  "khamis-mushait": {
    slug: "khamis-mushait",
    name: "خميس مشيط",
    region: "المنطقة الجنوبية",
  },
  "bisha": {
    slug: "bisha",
    name: "بيشة",
    region: "المنطقة الجنوبية",
  },
  "muhayil-asir": {
    slug: "muhayil-asir",
    name: "محايل عسير",
    region: "المنطقة الجنوبية",
  },
  "tathlith": {
    slug: "tathlith",
    name: "تثليث",
    region: "المنطقة الجنوبية",
  },
  "al-namas": {
    slug: "al-namas",
    name: "النماص",
    region: "المنطقة الجنوبية",
  },
  "dhahran-al-janub": {
    slug: "dhahran-al-janub",
    name: "ظهران الجنوب",
    region: "المنطقة الجنوبية",
  },
  "sarat-abidah": {
    slug: "sarat-abidah",
    name: "سراة عبيدة",
    region: "المنطقة الجنوبية",
  },
  "rijal-almaa": {
    slug: "rijal-almaa",
    name: "رجال ألمع",
    region: "المنطقة الجنوبية",
  },
  "balqarn": {
    slug: "balqarn",
    name: "بلقرن",
    region: "المنطقة الجنوبية",
  },
  "ahad-rafidah": {
    slug: "ahad-rafidah",
    name: "أحد رفيدة",
    region: "المنطقة الجنوبية",
  },
  "tanomah": {
    slug: "tanomah",
    name: "تنومة",
    region: "المنطقة الجنوبية",
  },
  "bariq": {
    slug: "bariq",
    name: "بارق",
    region: "المنطقة الجنوبية",
  },
  "al-majardah": {
    slug: "al-majardah",
    name: "المجاردة",
    region: "المنطقة الجنوبية",
  },
  "tarib": {
    slug: "tarib",
    name: "طريب",
    region: "المنطقة الجنوبية",
  },
  "al-birk": {
    slug: "al-birk",
    name: "البرك",
    region: "المنطقة الجنوبية",
  },
  "al-harajah": {
    slug: "al-harajah",
    name: "الحرجة",
    region: "المنطقة الجنوبية",
  },
  "al-amwah": {
    slug: "al-amwah",
    name: "الأمواه",
    region: "المنطقة الجنوبية",
  },
  "jazan": {
    slug: "jazan",
    name: "جازان",
    region: "المنطقة الجنوبية",
  },
  "sabya": {
    slug: "sabya",
    name: "صبيا",
    region: "المنطقة الجنوبية",
  },
  "abu-arish": {
    slug: "abu-arish",
    name: "أبو عريش",
    region: "المنطقة الجنوبية",
  },
  "samtah": {
    slug: "samtah",
    name: "صامطة",
    region: "المنطقة الجنوبية",
  },
  "al-darb": {
    slug: "al-darb",
    name: "الدرب",
    region: "المنطقة الجنوبية",
  },
  "bish": {
    slug: "bish",
    name: "بيش",
    region: "المنطقة الجنوبية",
  },
  "dhamad": {
    slug: "dhamad",
    name: "ضمد",
    region: "المنطقة الجنوبية",
  },
  "farasan": {
    slug: "farasan",
    name: "فرسان",
    region: "المنطقة الجنوبية",
  },
  "ahad-al-masarihah": {
    slug: "ahad-al-masarihah",
    name: "أحد المسارحة",
    region: "المنطقة الجنوبية",
  },
  "al-harth": {
    slug: "al-harth",
    name: "الحرث",
    region: "المنطقة الجنوبية",
  },
  "al-aridah": {
    slug: "al-aridah",
    name: "العارضة",
    region: "المنطقة الجنوبية",
  },
  "al-aydabi": {
    slug: "al-aydabi",
    name: "العيدابي",
    region: "المنطقة الجنوبية",
  },
  "al-dair": {
    slug: "al-dair",
    name: "الدائر",
    region: "المنطقة الجنوبية",
  },
  "al-rayth": {
    slug: "al-rayth",
    name: "الريث",
    region: "المنطقة الجنوبية",
  },
  "fayfa": {
    slug: "fayfa",
    name: "فيفا",
    region: "المنطقة الجنوبية",
  },
  "al-tuwal": {
    slug: "al-tuwal",
    name: "الطوال",
    region: "المنطقة الجنوبية",
  },
  "harub": {
    slug: "harub",
    name: "هروب",
    region: "المنطقة الجنوبية",
  },
  "najran": {
    slug: "najran",
    name: "نجران",
    region: "المنطقة الجنوبية",
  },
  "sharurah": {
    slug: "sharurah",
    name: "شرورة",
    region: "المنطقة الجنوبية",
  },
  "hubuna": {
    slug: "hubuna",
    name: "حبونا",
    region: "المنطقة الجنوبية",
  },
  "badr-al-janub": {
    slug: "badr-al-janub",
    name: "بدر الجنوب",
    region: "المنطقة الجنوبية",
  },
  "yadamah": {
    slug: "yadamah",
    name: "يدمة",
    region: "المنطقة الجنوبية",
  },
  "thar": {
    slug: "thar",
    name: "ثار",
    region: "المنطقة الجنوبية",
  },
  "khabash": {
    slug: "khabash",
    name: "خباش",
    region: "المنطقة الجنوبية",
  },
  "al-baha": {
    slug: "al-baha",
    name: "الباحة",
    region: "المنطقة الجنوبية",
  },
  "baljurashi": {
    slug: "baljurashi",
    name: "بلجرشي",
    region: "المنطقة الجنوبية",
  },
  "al-mandaq": {
    slug: "al-mandaq",
    name: "المندق",
    region: "المنطقة الجنوبية",
  },
  "al-mikhwah": {
    slug: "al-mikhwah",
    name: "المخواة",
    region: "المنطقة الجنوبية",
  },
  "qilwah": {
    slug: "qilwah",
    name: "قلوة",
    region: "المنطقة الجنوبية",
  },
  "al-aqiq": {
    slug: "al-aqiq",
    name: "العقيق",
    region: "المنطقة الجنوبية",
  },
  "al-qura": {
    slug: "al-qura",
    name: "القرى",
    region: "المنطقة الجنوبية",
  },
  "bani-hasan": {
    slug: "bani-hasan",
    name: "بني حسن",
    region: "المنطقة الجنوبية",
  },
  "ghamid-al-zinad": {
    slug: "ghamid-al-zinad",
    name: "غامد الزناد",
    region: "المنطقة الجنوبية",
  },
  "al-hajrah": {
    slug: "al-hajrah",
    name: "الحجرة",
    region: "المنطقة الجنوبية",
  },
} as const;

export type CitySlug = keyof typeof cities;
export type CityInfo = (typeof cities)[CitySlug];

export const serviceSlugs = Object.keys(services) as ServiceSlug[];
export const citySlugs = Object.keys(cities) as CitySlug[];

export function isServiceSlug(value: string): value is ServiceSlug {
  return value in services;
}

export function isCitySlug(value: string): value is CitySlug {
  return value in cities;
}

export function getSeoTitle(service: ServiceInfo, city: CityInfo) {
  return `${service.searchName} ${city.name}`;
}

export function getServiceCityUrl(
  serviceSlug: ServiceSlug,
  citySlug: CitySlug,
) {
  return `${SITE_URL}/services/${serviceSlug}/${citySlug}`;
}