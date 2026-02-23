import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
//get number of items and categories
const itemCount = await prisma.item.count();
const categoryCount = await prisma.category.count();
const StockCount = await prisma.item
  .aggregate({
    _sum: {
      stock: true,
    },
  })
  .then((res) => res._sum.stock ?? 0);
const stats = [
  {
    label: "Total Items",
    value: itemCount.toString(),
    icon: "📦",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    label: "Categories",
    value: categoryCount.toString(),
    icon: "🏷️",
    color: "from-violet-500 to-violet-600",
  },
  {
    label: "Total Stock",
    value: StockCount.toString(),
    icon: "📊",
    color: "from-sky-500 to-sky-600",
  },
];

const quickLinks = [
  {
    title: "Categories",
    description: "Browse and manage product categories.",
    href: "categories",
    icon: "🏷️",
  },
  {
    title: "All Items",
    description: "View inventory items and stock levels.",
    href: "items",
    icon: "📋",
  },
  {
    title: "Add New Item",
    description: "Register a new product in the system.",
    href: "items/new",
    icon: "➕",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-300">
            Inventory Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Manage your inventory
            <br />
            <span className="text-indigo-400">with confidence.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-400">
            Track stock levels, organize categories, and keep your
            products updated — all in one place.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 -mt-10">
        {/* Stats Cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-xl text-white shadow-sm`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Links */}
        <section className="mt-10 mb-16">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickLinks.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md hover:ring-indigo-200"
              >
                <span className="mb-3 text-2xl">{card.icon}</span>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1 flex-1 text-sm text-slate-500">
                  {card.description}
                </p>
                <span className="mt-4 text-sm font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
