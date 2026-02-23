// app/items/[id]/page.tsx

import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Params = {
  id: string;
};

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/items" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Items
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">{item.name}</h1>
          <p className="text-slate-500 text-sm">Item #{item.id}</p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description
              </label>
              <p className="text-slate-700 mt-1.5 text-sm leading-relaxed">
                {item.description || "No description"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </label>
                <p className="mt-1.5">
                  {item.category ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {item.category.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">—</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  ID
                </label>
                <p className="text-slate-700 mt-1.5 text-sm font-mono">#{item.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Price
                </label>
                <p className="text-2xl font-bold text-indigo-600 mt-1.5">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Stock
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <p className="text-2xl font-bold text-slate-900">
                    {item.stock}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.stock > 10
                        ? "bg-emerald-50 text-emerald-700"
                        : item.stock > 0
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {item.stock > 10 ? "In Stock" : item.stock > 0 ? "Low" : "Out"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/items"
            className="flex-1 text-center border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Back to List
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
    </main>
  );
}
