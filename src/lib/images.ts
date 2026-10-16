// Responsive image sources. Files live in /public/images and are WebP.
// Hero photos: {name}-{1600|1920|2560|3840}.webp (16:10 landscape), {name}-{900|1400}.webp (3:4 portrait for phones),
// The browser picks the smallest file that is sharp on the current screen.

const HERO = '/images/hero';

/** Landscape set up to 4K, for full-width and large placements */
export const heroSrcSet = (name: string) =>
  [1600, 1920, 2560, 3840].map((w) => `${HERO}/${name}-${w}.webp ${w}w`).join(', ');

/** Portrait crops for phones */
export const heroMobileSrcSet = (name: string) => `${HERO}/${name}-900.webp 900w, ${HERO}/${name}-1400.webp 1400w`;

export const heroSrc = (name: string) => `${HERO}/${name}-1920.webp`;

/** About-section team photo, 4:5 portrait */
export const teamSrcSet = ['700', '1200', '1800'].map((w) => `/images/sections/team-${w}.webp ${w}w`).join(', ');

/** Portfolio photos: /images/work/{name}-{800|1200|1600}.webp (4:3) */
export const workSrcSet = (name: string) => [800, 1200, 1600].map((w) => `/images/work/${name}-${w}.webp ${w}w`).join(', ');
export const workSrc = (name: string) => `/images/work/${name}-1200.webp`;

/** Inner-page header photos: /images/pages/{about|services|process|packages|work|contact}-{1600|1920|2560|3840|900|1400}.webp */
const PAGES = '/images/pages';
export const pageSrc = (name: string) => `${PAGES}/${name}-1920.webp`;
export const pageSrcSet = (name: string) => [1600, 1920, 2560, 3840].map((w) => `${PAGES}/${name}-${w}.webp ${w}w`).join(', ');
export const pageMobileSrcSet = (name: string) => `${PAGES}/${name}-900.webp 900w, ${PAGES}/${name}-1400.webp 1400w`;

/** Service photos (home cards and Services page rows): /images/services/{key}-{800|1200|1600|2000}.webp (4:3) */
const SERVICES = '/images/services';
export const serviceSrc = (name: string) => `${SERVICES}/${name}-1200.webp`;
export const serviceSrcSet = (name: string) => [800, 1200, 1600, 2000].map((w) => `${SERVICES}/${name}-${w}.webp ${w}w`).join(', ');
