// app/items/[id]/page.tsx

import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageHeader from "@/app/components/page-header";
import Breadcrumbs from "@/app/components/breadcrumbs";
import BadgeStock from "@/app/components/badge-stock";
import { ArrowLeft, Trash2, Package, Tag, DollarSign, Archive } from "lucide-react";

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

  const fields = [
    {
      icon: Tag,
      label: "Category",
      value: item.category ? (
        <Link
          href={`/categories/${item.category.id}`}
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
        >
          {item.category.name}
        </Link>
      ) : (
        <span className="text-sm italic" style={{ color: "var(--text-subtle)" }}>No category</span>
      ),
    },
    {
      icon: DollarSign,
      label: "Price",
      value: (
        <span className="text-xl font-bold" style={{ color: "var(--primary)" }}>
          ${Number(item.price).toFixed(2)}
        </span>
      ),
    },
    {
      icon: Archive,
      label: "Stock",
      value: <BadgeStock stock={item.stock} />,
    },
    {
      icon: Package,
      label: "Item ID",
      value: <span className="font-mono text-sm">#{item.id}</span>,
    },
  ];

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={item.name}
        description="Item details and management options."
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Items", href: "/items" },
              { label: item.name },
            ]}
          />
        }
        actions={
          <Link
            href="/items"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <ArrowLeft size={14} /> Back
          </Link>
        }
      />

      {/* Details card */}
      <div
        className="rounded-xl overflow-hidden mb-4"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Description */}
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-subtle)" }}>
            Description
          </p>
          <p className="text-sm" style={{ color: item.description ? "var(--text)" : "var(--text-subtle)" }}>
            {item.description || "No description provided."}
          </p>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-2">
          {fields.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className="px-6 py-4 flex flex-col gap-2"
              style={{
                borderBottom: i < 2 ? `1px solid var(--border)` : undefined,
                borderRight: i % 2 === 0 ? `1px solid var(--border)` : undefined,
              }}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={13} style={{ color: "var(--text-subtle)" }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
                  {label}
                </span>
              </div>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <form action={deleteItem}>
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: "var(--destructive-subtle)",
            color: "var(--destructive)",
            border: "1px solid var(--destructive)",
          }}
        >
          <Trash2 size={14} /> Delete Item
        </button>
      </form>
    </div>
  );
}
