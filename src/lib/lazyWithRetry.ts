import { lazy, type ComponentType } from 'react';

const FLAG = 'vb-chunk-reloaded';

/**
 * Like React.lazy, but if a page's code fails to download (poor connection, or the site was updated while the tab
 * was open) it reloads the page once to fetch fresh files, instead of leaving a blank screen. A second failure
 * is passed on to the error screen.
 */
// Page components take no props, but `any` keeps this helper usable for any lazily loaded component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const module = await load();
      try { sessionStorage.removeItem(FLAG); } catch { /* storage can be unavailable */ }
      return module;
    } catch (error) {
      let alreadyTried = true;
      try {
        alreadyTried = sessionStorage.getItem(FLAG) === '1';
        if (!alreadyTried) sessionStorage.setItem(FLAG, '1');
      } catch { /* if storage is blocked, do not loop: fall through to the error screen */ }
      if (!alreadyTried) {
        window.location.reload();
        return new Promise<never>(() => {}); // wait for the reload
      }
      throw error;
    }
  });
}
