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
  const params = await props.params;
  const itemId = Number(params.id);

  if (Number.isNaN(itemId)) {
    notFound();
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { category: true },
  });

  if (!item) {
    notFound();
  }

  const stockStatus =
    item.stock > 10
      ? { label: "In Stock", class: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50" }
      : item.stock > 0
      ? { label: "Low Stock", class: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/50" }
      : { label: "Out of Stock", class: "bg-red-50 text-red-700 ring-1 ring-red-200/50" };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/items" className="hover:text-indigo-600 transition-colors">
            Items
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{item.name}</span>
        </nav>

        {/* Item Card */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{item.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">ID #{item.id}</p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${stockStatus.class}`}
              >
                {stockStatus.label}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-5">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Description
              </label>
              <p className="text-sm text-slate-700 mt-1">
                {item.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Category
                </label>
                <p className="text-sm text-slate-800 mt-1 font-medium">
                  {item.category?.name || "—"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Price
                </label>
                <p className="text-lg font-bold text-indigo-600 mt-1">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Stock Quantity
              </label>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {item.stock}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
            <Link
              href="/items"
              className="flex-1 text-center border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              ← Back to List
            </Link>
            <form action={deleteItem} className="flex-1">
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="w-full bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Delete Item
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
