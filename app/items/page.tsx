// app/items/page.tsx

import { prisma } from "../lib/prisma";
import Link from "next/link";

type SearchParams = {
  q?: string;
};

export default async function ItemsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q?.trim() || "";

  const where =
    searchQuery !== ""
      ? {
          name: {
            contains: searchQuery,
          },
        }
      : undefined;

  const items = await prisma.item.findMany({
    where,
    orderBy: { id: "asc" },
    include: {
      category: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">All Items</h1>
              <p className="text-slate-500 mt-1 text-sm">
                {items.length} item{items.length !== 1 ? "s" : ""} in inventory
              </p>
            </div>
            <Link
              href="/items/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Item
            </Link>
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
                  placeholder="Search items by name..."
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
                  href="/items"
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

        {/* Items Table */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center ring-1 ring-slate-200/60">
            <div className="text-slate-300 mb-4 text-5xl">📦</div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              No items found
            </h3>
            <p className="text-sm text-slate-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first item"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-400 font-mono">
                        #{item.id}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                        {item.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50">
                            {item.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">
                            No Category
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-slate-800">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            item.stock > 10
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50"
                              : item.stock > 0
                              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/50"
                              : "bg-red-50 text-red-700 ring-1 ring-red-200/50"
                          }`}
                        >
                          {item.stock} in stock
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                        <Link
                          href={`/items/${item.id}`}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-xs"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
