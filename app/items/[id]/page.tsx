// app/items/[id]/page.tsx

import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Params = {
  id: string;
};

// Server Action لحذف item
async function deleteItem(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  if (Number.isNaN(id)) {
    throw new Error("Invalid item id");
  }

  await prisma.item.delete({
    where: { id },
  });

  redirect("/items");
}

export default async function ItemDetailsPage(props: {
  params: Promise<Params>;
}) {
  // 1) فك params
  const params = await props.params;
  const itemId = Number(params.id);

  if (Number.isNaN(itemId)) {
    notFound();
  }

  // 2) جلب item من DB
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { category: true },
  });

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
          <p className="text-gray-500">Item Details</p>
        </div>

        {/* Details List */}
        <div className="space-y-6 mb-8">
          <div className="border-b pb-4">
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="text-gray-800 mt-1">
              {item.description || "No description"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">
                Category
              </label>
              <p className="text-gray-800 mt-1">{item.category?.name || "—"}</p>
            </div>

            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="text-gray-800 mt-1">#{item.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">Price</label>
              <p className="text-xl font-semibold text-blue-600 mt-1">
                ${item.price}
              </p>
            </div>

            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">Stock</label>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {item.stock}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/items"
            className="flex-1 text-center border border-gray-300 text-gray-700 px-4 py-3 rounded hover:bg-gray-50 transition-colors"
          >
            Back to List
          </Link>
          <form action={deleteItem} className="flex-1">
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              className="w-full bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
