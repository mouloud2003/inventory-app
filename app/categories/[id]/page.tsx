import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

// هذا هو الشكل الصحيح للـ params
type Params = {
  id: string;
};

export default async function CategoryItemsPage(props: {
  params: Promise<Params>;
}) {
  // نفك الـ Promise ونأخذ id مباشرة
  const { id } = await props.params;

  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    // هنا أفضل نستعمل notFound بدل JSX عادي
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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {category.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {category.description || "No description provided."}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              {category.items.length} items
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {category.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              There are no items in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
              >
                <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {/* لو price عندك Number في Prisma ما تحتاج parseFloat */}
                  {item.price !== undefined && (
                    <span className="text-green-600 font-semibold">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  )}

                  {item.stock !== undefined && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.stock > 10
                          ? "bg-green-100 text-green-800"
                          : item.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
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
