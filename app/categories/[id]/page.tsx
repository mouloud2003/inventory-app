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
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/categories" className="hover:text-indigo-600 transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">
                {category.name}
              </h1>
              <p className="text-sm text-slate-500">
                {category.description || "No description provided."}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50">
              {category.items.length} items
            </span>
          </div>
        </div>

        {/* Items Grid */}
        {category.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center ring-1 ring-slate-200/60">
            <div className="text-slate-300 mb-4 text-5xl">📦</div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              No items found
            </h3>
            <p className="text-sm text-slate-500">
              There are no items in this category yet.
            </p>
            <Link
              href={`/items/new?categoryId=${category.id}`}
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              + Add an item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="group bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-5 hover:shadow-md hover:ring-indigo-200 transition-all"
              >
                <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  {item.price !== undefined && (
                    <span className="text-sm font-bold text-indigo-600">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  )}

                  {item.stock !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        item.stock > 10
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50"
                          : item.stock > 0
                          ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/50"
                          : "bg-red-50 text-red-700 ring-1 ring-red-200/50"
                      }`}
                    >
                      {item.stock} in stock
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
