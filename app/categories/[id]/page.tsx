import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = {
  id: string;
};

export default async function CategoryItemsPage(props: {
  params: Promise<Params>;
}) {
  const { id } = await props.params;

  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { items: true },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-6">
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {category.name}
              </h1>
              <p className="text-slate-500 leading-relaxed">
                {category.description || "No description provided."}
              </p>
            </div>
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
              {category.items.length} items
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {category.items.length === 0 ? (
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No items found
            </h3>
            <p className="text-slate-500">
              There are no items in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
              >
                <h3 className="font-semibold text-slate-900 text-base mb-1.5 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-slate-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  {item.price !== undefined && (
                    <span className="text-indigo-600 font-semibold text-sm">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  )}

                  {item.stock !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.stock > 10
                          ? "bg-emerald-50 text-emerald-700"
                          : item.stock > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {item.stock} in stock
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
