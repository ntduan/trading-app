'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const NavLink = ({
  href,
  children,
  className = '',
  exact = false,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
  exact?: boolean;
}) => {
  const pathname = usePathname();
  console.log('Current pathname:', pathname, href, exact, pathname.startsWith(href));
  const isActive = exact ? pathname === href : pathname.startsWith(href) && (href === '/' ? pathname === '/' : true);

  return (
    <Link
      href={href}
      className={cn('hover:text-primary-light', className, isActive ? 'text-primary-light' : '')}
      {...props}
    >
      {children}
    </Link>
  );
};
