import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resetScroll } from '../../lib/smoothScroll.ts';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    resetScroll();
  }, [pathname]);

  return null;
};
