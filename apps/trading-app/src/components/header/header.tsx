import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Trading App</h1>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/trade" className="hover:text-gray-300">
            Trade
          </Link>
        </div>
      </nav>
    </header>
  );
};
