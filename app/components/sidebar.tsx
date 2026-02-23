"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  PlusCircle,
  ChevronRight,
  Boxes,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Items", href: "/items", icon: Package },
  { label: "Categories", href: "/categories", icon: Tags },
];

const quickActions = [
  { label: "Add Item", href: "/items/new", icon: PlusCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? "4rem" : "15rem",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: "2rem",
            height: "2rem",
            background: "var(--sidebar-active)",
          }}
        >
          <Boxes size={16} color="white" />
        </div>
        {!collapsed && (
          <span
            className="font-bold text-base tracking-tight truncate"
            style={{ color: "var(--sidebar-text-active)" }}
          >
            Inventory Hub
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto shrink-0 rounded p-0.5 transition-colors"
          style={{ color: "var(--sidebar-text)" }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            size={14}
            style={{
              transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: active
                  ? "var(--sidebar-text-active)"
                  : "var(--sidebar-text)",
                background: active ? "var(--sidebar-active)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
              }}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}

        <div
          className="my-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        />

        {quickActions.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ color: "var(--sidebar-text)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--sidebar-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <Icon size={16} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
