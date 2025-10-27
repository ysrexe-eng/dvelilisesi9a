import { TimeSlot, WeeklySchedule, BookLinks } from './types';

export const TIME_SLOTS: TimeSlot[] = [
  { type: 'lesson', name: '1. Ders', start: [8, 30], end: [9, 10], period: 1 },
  { type: 'break', name: 'Teneffüs', start: [9, 10], end: [9, 25] },
  { type: 'lesson', name: '2. Ders', start: [9, 25], end: [10, 5], period: 2 },
  { type: 'break', name: 'Teneffüs', start: [10, 5], end: [10, 15] },
  { type: 'lesson', name: '3. Ders', start: [10, 15], end: [10, 55], period: 3 },
  { type: 'break', name: 'Teneffüs', start: [10, 55], end: [11, 5] },
  { type: 'lesson', name: '4. Ders', start: [11, 5], end: [11, 45], period: 4 },
  { type: 'break', name: 'Teneffüs', start: [11, 45], end: [11, 50] },
  { type: 'lesson', name: '5. Ders', start: [11, 50], end: [12, 30], period: 5 },
  { type: 'break', name: 'Öğle Arası', start: [12, 30], end: [13, 40] },
  { type: 'lesson', name: '6. Ders', start: [13, 40], end: [14, 20], period: 6 },
  { type: 'break', name: 'Teneffüs', start: [14, 20], end: [14, 30] },
  { type: 'lesson', name: '7. Ders', start: [14, 30], end: [15, 10], period: 7 },
  { type: 'break', name: 'Teneffüs', start: [15, 10], end: [15, 20] },
  { type: 'lesson', name: '8. Ders', start: [15, 20], end: [16, 0], period: 8 },
];

// 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
export const WEEKLY_SCHEDULE: WeeklySchedule = {
  1: [ // Pazartesi
    'Din Kültürü', 'Din Kültürü', 'Tarih', 'Tarih', 'Adab-ı Muaşeret', 'Coğrafya', 'Coğrafya', 'Coğrafya'
  ],
  2: [ // Salı
    'İngilizce', 'İngilizce', 'Almanca', 'Almanca', 'Türk Dili ve Edebiyatı', 'Rehberlik', 'Matematik', 'Matematik'
  ],
  3: [ // Çarşamba
    'Beden Eğitimi', 'Beden Eğitimi', 'Biyoloji', 'Biyoloji', 'Türk Dili ve Edebiyatı', 'Türk Dili ve Edebiyatı', 'Fizik', 'Fizik'
  ],
  4: [ // Perşembe
    'Görsel Sanatlar', 'Görsel Sanatlar', 'Klasik Ahlak Metinleri', 'Sağlık', 'Kimya', 'Kimya', 'Matematik', 'Matematik'
  ],
  5: [ // Cuma
    'Kur’an-ı Kerim', 'Kur’an-ı Kerim', 'İngilizce', 'İngilizce', 'Matematik', 'Matematik', 'Türk Dili ve Edebiyatı', 'Türk Dili ve Edebiyatı'
  ]
};

export const LESSON_MATERIALS: BookLinks = {
  'Türk Dili ve Edebiyatı': { type: 'interactive', links: 'https://ogmmateryal.eba.gov.tr/etkilesimli-kitap/tde?s=21&d=206&u=0&k=0', label: 'Etkileşimli Kitabı Aç' },
  'Biyoloji': { type: 'interactive', links: 'https://ogmmateryal.eba.gov.tr/etkilesimli-kitap/biyoloji?s=21&d=199&u=0&k=0', label: 'Etkileşimli Kitabı Aç' },
  'Coğrafya': { type: 'interactive', links: 'https://ogmmateryal.eba.gov.tr/etkilesimli-kitap/cografya?s=21&d=200&u=0&k=0', label: 'Etkileşimli Kitabı Aç' },
  'Fizik': { type: 'interactive', links: 'https://ogmmateryal.eba.gov.tr/etkilesimli-kitap/fizik?s=21&d=201&u=0&k=0', label: 'Etkileşimli Kitabı Aç' },
  'Kimya': { type: 'interactive', links: 'https://ogmmateryal.eba.gov.tr/etkilesimli-kitap/kimya?s=21&d=203&u=0&k=0', label: 'Etkileşimli Kitabı Aç' },
  'Matematik': { type: 'interactive', links: 'https://ogmmateryal.eba.gov.tr/etkilesimli-kitap/matematik?s=21&d=204&u=0&k=0', label: 'Etkileşimli Kitabı Aç' },
  'Tarih': { type: 'interactive', links: 'https://ogmmateryal.eba.gov.tr/etkilesimli-kitap/tarih?s=21&d=205&u=0&k=0', label: 'Etkileşimli Kitabı Aç' },
  'İngilizce': { type: 'presentation', links: 'https://eltarena.com/dashboard', label: 'Sunumu Aç' },
  'Sağlık': { type: 'pdf', links: 'https://drive.google.com/file/d/196Hp-53D-X1eLcQK0O9OLchehTBo-1Xa/view', label: 'Kitabı Aç (PDF)' },
  'Din Kültürü': { type: 'pdf', links: 'https://drive.google.com/file/d/1MIdXyaWvo4M-9oPOFn-zqqgwdqzVQM6a/view', label: 'Kitabı Aç (PDF)' },
  'Kur’an-ı Kerim': { type: 'pdf', links: 'https://drive.google.com/file/d/1LZGHeOpVtA8snjlH-XM9KXKx_mp17gEK/view', label: 'Kitabı Aç (PDF)' },
  'Almanca': {
    type: 'multi-pdf',
    label: 'Kitabı Aç (PDF)',
    links: [
      { name: 'Ders Kitabı', url: 'https://drive.google.com/file/d/1MhJdzJzu5lAtjOrwa9q3VgtyzLxkeZEC/view' },
      { name: 'Çalışma Kitabı', url: 'https://drive.google.com/file/d/190-VTJEnbdc65BN_mNZ_kfqbbwtjdhLU/view' },
    ]
  },
};

export const LESSON_ABBREVIATIONS: { [key: string]: string } = {
  'Klasik Ahlak Metinleri': 'KAM',
  'Türk Dili ve Edebiyatı': 'TDVE',
};

export const DAY_NAMES: { [key: number]: string } = {
    0: "Pazar",
    1: "Pazartesi",
    2: "Salı",
    3: "Çarşamba",
    4: "Perşembe",
    5: "Cuma",
    6: "Cumartesi",
};