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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
              <p className="text-slate-500 mt-1">
                Manage your product categories
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200/80">
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
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium text-sm"
              >
                Search
              </button>
              {searchQuery && (
                <Link
                  href="/categories"
                  className="border border-slate-200 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 transition-colors font-medium text-slate-600 text-sm"
                >
                  Clear
                </Link>
              )}
            </form>

            {searchQuery && (
              <p className="text-sm text-slate-500 mt-3">
                Showing results for:{" "}
                <span className="font-semibold text-slate-900">
                  &quot;{searchQuery}&quot;
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200/80">
            <div className="text-slate-300 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No categories found
            </h3>
            <p className="text-slate-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="block bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <svg
                    className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {cat.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    {cat._count.items} items
                  </span>
                  <span className="text-indigo-600 text-sm font-medium group-hover:underline">
                    View category →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
