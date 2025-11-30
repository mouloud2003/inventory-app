// app/items/page.tsx

import { prisma } from "../lib/prisma"; // لو عندك alias استخدم "@/lib/prisma"
import Link from "next/link";

type SearchParams = {
  q?: string;
};

export default async function ItemsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  // 1) نقرأ searchParams من ال URL (مثلاً /items?q=phone)
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q?.trim() || "";

  // 2) نبني شرط البحث
  const where = searchQuery
    ? {
        name: {
          contains: searchQuery,
          mode: "insensitive", // بحث غير حساس لحالة الأحرف
        },
      }
    : {};

  // 3) نجلب العناصر مع تطبيق شرط where (لو searchQuery فارغ → يرجع كل العناصر)
  const items = await prisma.item.findMany({
    where,
    orderBy: { id: "asc" },
    include: {
      category: true,
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald-900">All Items</h1>
              <p className="text-emerald-700 mt-2">
                Manage your inventory items
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-emerald-700 border border-emerald-300 px-4 py-2 rounded-lg bg-white hover:bg-emerald-50 transition-colors font-medium"
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
              <Link
                href="/items/new"
                className="inline-flex items-center gap-2 text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
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
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <form className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-emerald-400"
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
                  className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Search
              </button>
              {searchQuery && (
                <Link
                  href="/items"
                  className="border border-emerald-300 px-6 py-3 rounded-lg bg-white hover:bg-emerald-50 transition-colors font-medium text-emerald-700"
                >
                  Clear
                </Link>
              )}
            </form>

            {searchQuery && (
              <p className="text-sm text-emerald-700 mt-3">
                Showing results for:{" "}
                <span className="font-semibold text-emerald-900">
                  "{searchQuery}"
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-emerald-100">
            <div className="text-emerald-400 mb-4">
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-emerald-900 mb-2">
              No items found
            </h3>
            <p className="text-emerald-600">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first item"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-emerald-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-emerald-25"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-900 font-medium">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700">
                        {item.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {item.category.name}
                          </span>
                        ) : (
                          <span className="text-emerald-500 italic">
                            No Category
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-900">
                        ${parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.stock > 10
                              ? "bg-green-100 text-green-800"
                              : item.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/items/${item.id}`}
                          className="text-emerald-600 hover:text-emerald-900 transition-colors font-medium"
                        >
                          View Details
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
