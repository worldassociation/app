import Link from 'next/link';
import NavMenu from './NavMenu';
import SignInButton from './SignInButton';
import ThemeSwitcher from './ThemeSwitcher';
import NavDropdown from './NavDropdown';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="box-border size-[30px] rounded-full border-[5px] border-foreground"></div>
          <p className="text-[21px] font-extrabold">World Association</p>
        </Link>
        <NavMenu />
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <SignInButton />
        <NavDropdown />
      </div>
    </header>
  );
}
