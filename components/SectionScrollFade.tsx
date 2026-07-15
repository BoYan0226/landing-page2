'use client';

import { useEffect } from 'react';

const MOBILE_BREAKPOINT_PX = 767;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function SectionScrollFade() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-landing-scroll-root]');
    if (!root) return undefined;

    let frame: number | null = null;
    let sections: HTMLElement[] = [];

    const refreshSections = () => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-scroll-fade-section]')
      );
    };

    const update = () => {
      frame = null;

      if (window.innerWidth <= MOBILE_BREAKPOINT_PX) {
        sections.forEach(section => {
          section.style.setProperty('--section-scroll-opacity', '1');
        });
        return;
      }

      const viewportHeight = root.clientHeight || window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      const rootTop = root.getBoundingClientRect().top;

      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top - rootTop;
        const fadeProgress = clamp(
          (-sectionTop - viewportHeight * 0.18) / Math.max(1, viewportHeight * 0.34)
        );
        const opacity = 1 - fadeProgress * 0.9;

        section.style.setProperty('--section-scroll-opacity', opacity.toFixed(3));
      });
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      refreshSections();
      requestUpdate();
    };

    refreshSections();
    requestUpdate();
    root.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      root.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
      sections.forEach(section => {
        section.style.removeProperty('--section-scroll-opacity');
      });
    };
  }, []);

  return null;
}
