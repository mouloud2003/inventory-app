// app/items/new/page.tsx

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  redirect("/items");
}

export default async function NewItemPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const preselectedCategoryId = searchParams.categoryId
    ? Number(searchParams.categoryId)
    : undefined;

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/items" className="hover:text-indigo-600 transition-colors">
            Items
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">New Item</span>
        </nav>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h1 className="text-lg font-bold text-slate-900">Create New Item</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Add a new product to your inventory
            </p>
          </div>

          <form action={createItem} className="px-6 py-5 space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Item Name
              </label>
              <input
                name="name"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                placeholder="Enter item name"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
                placeholder="Enter item description (optional)"
              />
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="w-full pl-7 pr-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    placeholder="0.00"
                    required
                    aria-label="price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  defaultValue={0}
                  aria-label="stock"
                />
              </div>
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select
                name="categoryId"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-sm"
                defaultValue={preselectedCategoryId ?? ""}
                required
                aria-label="category"
              >
                <option value="" disabled className="text-slate-400">
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm shadow-sm"
              >
                Create Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
