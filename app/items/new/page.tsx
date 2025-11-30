// app/items/new/page.tsx

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

type SearchParams = {
  categoryId?: string;
};

// Server Action لإنشاء Item جديد
async function createItem(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const categoryId = Number(formData.get("categoryId"));

  // يمكنك إضافة validation بسيطة
  if (!name || Number.isNaN(price) || Number.isNaN(categoryId)) {
    throw new Error("Invalid input");
  }

  await prisma.item.create({
    data: {
      name,
      description,
      price,
      stock: Number.isNaN(stock) ? 0 : stock,
      categoryId,
    },
  });

  // بعد الإنشاء نرجع لصفحة items
  redirect("/items");
}

export default async function NewItemPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  // 1) فكّ searchParams
  const searchParams = await props.searchParams;

  // 2) جلب كل الكاتيغوريز لعرضها في select
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 3) categoryId القادم من ال URL (اختياري)
  const preselectedCategoryId = searchParams.categoryId
    ? Number(searchParams.categoryId)
    : undefined;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Item</h1>
          <p className="text-gray-600 mt-2">Add a new item to your inventory</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form action={createItem} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <input
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter item name"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter item description (optional)"
              />
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    required
                    aria-label="price"
                  />
                </div>
              </div>

              {/* Stock Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  defaultValue={0}
                  aria-label="stock"
                />
              </div>
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                defaultValue={preselectedCategoryId ?? ""}
                required
                aria-label="category"
              >
                <option value="" disabled className="text-gray-400">
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="text-gray-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Item
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
