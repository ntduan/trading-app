'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useMounted } from '@/hooks/useIsMounted';
import { cn } from '@/lib/utils';

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();

  const isMounted = useMounted();

  if (!isMounted) return null;

  return (
    <div
      className={cn('cursor-pointer hover:text-primary-light font-bold', className)}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </div>
  );
};
