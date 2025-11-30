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
  { label: "Total Items", value: itemCount.toString() },
  { label: "Categories", value: categoryCount.toString() },
  { label: "Low Stock Alerts", value: StockCount.toString() },
];

const quickLinks = [
  {
    title: "Category Planner",
    description: "Refine product groups and maintain hierarchy.",
    href: "categories",
  },
  {
    title: "Inventory Overview",
    description: "Review stock counts and movement at a glance.",
    href: "items",
  },
  {
    title: "Register Product",
    description: "Add a new item with guided data entry.",
    href: "items/new",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex max-w-5xl flex-col gap-14 px-6 py-20">
        <header className="space-y-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-700">
            Inventory Command
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Command your stock with confident decisions
            </h1>
            <p className="text-base text-slate-600">
              Surface priorities instantly, coordinate teams, and keep every
              shelf ready for demand.
            </p>
          </div>
        </header>

        <section className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="space-y-2 text-center sm:text-left"
            >
              <p className="text-sm uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="text-3xl font-semibold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {card.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">
                {card.description}
              </p>
              <span className="mt-4 text-sm font-semibold text-lime-600">
                Explore →
              </span>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
