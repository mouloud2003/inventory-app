"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Monitor, Menu, X, Boxes, Package, Tags, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Items", href: "/items", icon: Package },
  { label: "Categories", href: "/categories", icon: Tags },
];

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const themes = [
    { key: "light", icon: Sun },
    { key: "dark", icon: Moon },
    { key: "system", icon: Monitor },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          height: "3.5rem",
        }}
      >
        {/* Mobile logo */}
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 font-bold text-sm"
          style={{ color: "var(--text)" }}
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "1.75rem",
              height: "1.75rem",
              background: "var(--primary)",
            }}
          >
            <Boxes size={14} color="white" />
          </div>
          Inventory Hub
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme toggle */}
        {mounted && (
          <div
            className="flex items-center gap-0.5 rounded-lg p-1"
            style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
          >
            {themes.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className="rounded-md p-1.5 transition-colors"
                style={{
                  background: theme === key ? "var(--surface)" : "transparent",
                  color: theme === key ? "var(--primary)" : "var(--text-muted)",
                  boxShadow: theme === key ? "var(--shadow-sm)" : "none",
                }}
                aria-label={`Switch to ${key} mode`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        )}

        {/* Mobile menu button */}
        <button
          className="lg:hidden rounded-lg p-1.5 transition-colors"
          style={{ color: "var(--text-muted)", background: "var(--surface-raised)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="lg:hidden flex flex-col gap-1 px-4 py-3 border-b"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  color: active ? "var(--primary)" : "var(--text-muted)",
                  background: active ? "var(--primary-subtle)" : "transparent",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
