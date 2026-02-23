// app/categories/page.tsx

import { prisma } from "../lib/prisma";
import Link from "next/link";
import PageHeader from "../components/page-header";
import EmptyState from "../components/empty-state";
import { Tags, Search, X, Package, ChevronRight } from "lucide-react";

type CatShape = { id: number; name: string; description: string | null; _count: { items: number } };

type SearchParams = {
  q?: string;
};

export default async function CategoriesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  // 1) قراءة searchParams من ال URL (مثلاً /categories?q=elec)
  const { q = "" } = await props.searchParams;
  const searchQuery = q.trim();

  // 2) بناء شرط where حسب وجود البحث
  const where = searchQuery
    ? {
        name: {
          contains: searchQuery,
        },
      }
    : {};

  // 3) جلب الكاتيغوريز من Prisma مع الشرط
  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organise your inventory into logical product groups."
      />

      {/* Search */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <form className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              name="q"
              placeholder="Search categories…"
              defaultValue={searchQuery}
              className="w-full rounded-lg pl-9 pr-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            Search
          </button>
          {searchQuery && (
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <X size={14} /> Clear
            </Link>
          )}
        </form>
        {searchQuery && (
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            Results for <strong style={{ color: "var(--text)" }}>&quot;{searchQuery}&quot;</strong>
          </p>
        )}
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No categories found" : "No categories yet"}
          description={
            searchQuery
              ? "Try adjusting your search."
              : "Categories help you organise your inventory. Create your first one."
          }
          icon={<Tags size={28} />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(categories as CatShape[]).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 hover:-translate-y-0.5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="rounded-lg p-2"
                  style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
                >
                  <Tags size={16} />
                </div>
                <ChevronRight
                  size={16}
                  className="mt-0.5 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--text-subtle)" }}
                />
              </div>
              <div>
                <h3
                  className="font-semibold text-sm mb-1 group-hover:underline"
                  style={{ color: "var(--text)" }}
                >
                  {cat.name}
                </h3>
                <p
                  className="text-xs line-clamp-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cat.description || "No description provided."}
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 pt-3 border-t text-xs font-medium"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <Package size={12} />
                {cat._count.items} item{cat._count.items !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
