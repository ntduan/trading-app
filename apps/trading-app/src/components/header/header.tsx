import Link from 'next/link';

import { SwitchTheme } from './switch-theme';

export const Header = () => {
  return (
    <header className="bg-card text-foreground px-6 py-5">
      <div className="flex">
        <h1 className="text-xl italic">Trading App</h1>
        <nav className="flex space-x-8 ml-10 text-sm items-center">
          <Link href="/trade">Trade</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="flex items-center ml-auto">
          <SwitchTheme />
        </div>
      </div>
    </header>
  );
};
