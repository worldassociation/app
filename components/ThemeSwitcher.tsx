'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className="mt-auto hidden rounded-full p-[11px] transition-colors hover:bg-muted md:block"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <Sun className="size-[18px]" strokeWidth={1} />
      ) : (
        <Moon className="size-[18px]" strokeWidth={1} />
      )}
    </button>
  );
};

export default ThemeSwitcher;
