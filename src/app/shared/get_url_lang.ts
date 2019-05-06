export function getLangUrl(): string {
  const urlEn = '../../assets/i18n/datatables/en.json';
  const urlVi = '../../assets/i18n/datatables/vi.json';
  const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  return  lang === 'en' ? urlEn : urlVi;
}
