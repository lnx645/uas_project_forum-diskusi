import { Link } from "react-router";
import { Button } from "./Button";
import { Input } from "./Input";
import { formatReputation } from "../core/formatter";

function Logo() {
  return (
    <h1 className="mr-8 shrink-0 text-base font-bold text-(--black-600)">
      Mardira Forums
    </h1>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={href}
      className="transition-colors text-xs flex-1 px-3 p-1.5 font-medium text-(--black-500) hover:bg-[var(--black-100)] hover:text-[var(--black-600)] rounded"
    >
      {children}
    </Link>
  );
}

function Navigation() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/questions", label: "Questions" },
    { href: "/tags", label: "Tags" },
  ];

  return (
    <div className="hidden items-center text-sm md:flex gap-1">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href}>
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}

function Search() {
  return (
    <div className="mx-8 flex-1">
      <Input inputSize="sm" placeholder="Search questions..." />
    </div>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      {/* Tombol Login (Outline) */}
      <Button
        size="sm"
        variant="outline"
        className="border-(--theme-button-outlined-border-color) text-(--theme-button-color) hover:bg-(--theme-button-hover-background-color)"
      >
        Login
      </Button>

      {/* Tombol Register (Primary Orange) */}
      <Button
        size="sm"
        className="bg-(--theme-button-primary-background-color) text-(--theme-button-primary-color) hover:bg-(--theme-button-primary-hover-background-color) active:bg-(--theme-button-primary-active-background-color)"
      >
        Register
      </Button>
    </div>
  );
}

// Komponen Utama Header
export function Header({ user }: any) {
  return (
    <header className="sticky top-0 z-50 w-full bg-(--theme-content-background-color) border-b border-(--theme-content-border-color) border-t-[3px] border-t-(--theme-primary-custom-400) backdrop-blur">
      <nav className="container mx-auto flex h-14 items-center px-10">
        <Logo />
        <Navigation />
        <Search />
        {user ? <UserAuthenticated user={user} /> : <AuthButtons />}
      </nav>
    </header>
  );
}

// Komponen User Profile yang sudah terautentikasi
export const UserAuthenticated = ({ user }: any) => {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex items-center gap-2 text-xs font-sans p-1  rounded   max-w-fit">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-7 h-7 rounded bg-sky-100 object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded bg-[#70B7EB] text-white flex items-center justify-center font-bold text-sm shrink-0">
          {initial}
        </div>
      )}

      <div className="flex flex-col leading-tight pr-1">
        <span className="text-(--theme-link-color) text-xs hover:text-(--theme-link-color-hover) cursor-pointer font-medium">
          {user?.name || "Anonymous"}
        </span>

        <div className="flex items-center gap-1.5 mt-0.5 text-(--black-500)">
          <span className="font-normal text-(--black-600)">
            {formatReputation(user?.reputation) ?? 0}
          </span>
          {(user?.reputation ?? 0) >= 100 && (
            <div className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#FFCC00]"
                title="Gold badge"
              ></span>
              <span className="text-[10px]">1</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
