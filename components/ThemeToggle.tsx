import { useTheme } from 'next-themes';
import { Switch } from './ui/switch';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Switch
      checked={resolvedTheme === 'dark'}
      onCheckedChange={() =>
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }
    />
  );
};

export default ThemeToggle;
