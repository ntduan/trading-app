import { NavLink } from './nav-link';
import { SwitchTheme } from './switch-theme';

import { cn } from '@/lib/utils';

export const Header = () => {
  return (
    <header className="bg-card text-foreground px-6 py-5">
      <div className="flex">
        <h1 className="text-xl italic">Trading App</h1>
        <nav className="flex space-x-8 ml-10 text-sm items-center">
          <NavLink href="/trade" className={cn('hover:text-primary-light')}>
            Trade
          </NavLink>
          <NavLink href="/about" className={cn('hover:text-primary-light')}>
            About
          </NavLink>
        </nav>
        <div className="flex items-center ml-auto">
          <SwitchTheme />
        </div>
      </div>
    </header>
  );
};
