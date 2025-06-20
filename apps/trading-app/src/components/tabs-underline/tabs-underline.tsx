'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function TabsUnderline() {
  const [style, setStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = document.querySelector('[role="tablist"]');
    if (!el) return;

    const updateUnderline = () => {
      const active = el.querySelector('[data-state="active"]') as HTMLElement | null;
      if (active) {
        setStyle({
          left: active.offsetLeft,
          width: active.offsetWidth,
        });
      }
    };

    const observer = new ResizeObserver(updateUnderline);
    observer.observe(el);

    window.addEventListener('resize', updateUnderline);

    const mutationObserver = new MutationObserver(updateUnderline);
    mutationObserver.observe(el, { subtree: true, attributes: true });

    // 初始化
    updateUnderline();

    return () => {
      window.removeEventListener('resize', updateUnderline);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      className="absolute bottom-0 h-0.5 bg-primary dark:bg-primary"
      animate={style}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    />
  );
}
