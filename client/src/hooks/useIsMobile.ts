import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 1024): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (tid) clearTimeout(tid);
      tid = setTimeout(() => setIsMobile(window.innerWidth < breakpoint), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (tid) clearTimeout(tid);
    };
  }, [breakpoint]);

  return isMobile;
}

export function useWindowWidth(): number {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (tid) clearTimeout(tid);
      tid = setTimeout(() => setWidth(window.innerWidth), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (tid) clearTimeout(tid);
    };
  }, []);

  return width;
}
