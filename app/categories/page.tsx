// app/categories/page.tsx

import { prisma } from "../lib/prisma";
import Link from "next/link";

type SearchParams = {
  q?: string;
};

export default async function CategoriesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "" } = await props.searchParams;
  const searchQuery = q.trim();

  const where = searchQuery
    ? {
        name: {
          contains: searchQuery,
        },
      }
    : {};

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
              <p className="text-slate-500 mt-1 text-sm">
                {categories.length} categor{categories.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200/60">
            <form className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder="Search categories by name..."
                  defaultValue={searchQuery}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium"
              >
                Search
              </button>
              {searchQuery && (
                <Link
                  href="/categories"
                  className="border border-slate-200 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600"
                >
                  Clear
                </Link>
              )}
            </form>

            {searchQuery && (
              <p className="text-xs text-slate-500 mt-2">
                Results for{" "}
                <span className="font-semibold text-slate-700">
                  &quot;{searchQuery}&quot;
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center ring-1 ring-slate-200/60">
            <div className="text-slate-300 mb-4 text-5xl">🏷️</div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              No categories found
            </h3>
            <p className="text-sm text-slate-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="group bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-5 hover:shadow-md hover:ring-indigo-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50">
                    {cat._count.items} items
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {cat.description || "No description provided."}
                </p>

                <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors">
                  View category →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
