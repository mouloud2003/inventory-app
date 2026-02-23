// app/items/new/page.tsx

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import PageHeader from "@/app/components/page-header";
import Breadcrumbs from "@/app/components/breadcrumbs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type CatShape = { id: number; name: string };

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

  const inputStyle = {
    background: "var(--surface-raised)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: "var(--text-muted)",
    marginBottom: "0.375rem",
  } as React.CSSProperties;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Add New Item"
        description="Fill in the details below to register a new inventory item."
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Items", href: "/items" },
              { label: "New Item" },
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

      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <form action={createItem} className="space-y-5">
          {/* Name */}
          <div>
            <label style={labelStyle} htmlFor="name">
              Item Name <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              style={inputStyle}
              placeholder="e.g. Wireless Keyboard"
              required
              autoFocus
            />
            <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
              A clear, descriptive name for this item.
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Optional: brief description of the item…"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle} htmlFor="price">
                Price <span style={{ color: "var(--destructive)" }}>*</span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  style={{ ...inputStyle, paddingLeft: "1.75rem" }}
                  placeholder="0.00"
                  required
                  aria-label="price"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle} htmlFor="stock">
                Stock Quantity
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                name="stock"
                style={inputStyle}
                defaultValue={0}
                aria-label="stock"
              />
              <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
                Leave at 0 if not yet in stock.
              </p>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle} htmlFor="categoryId">
              Category <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              style={{ ...inputStyle, cursor: "pointer" }}
              defaultValue={preselectedCategoryId ?? ""}
              required
              aria-label="category"
            >
              <option value="" disabled style={{ color: "var(--text-subtle)" }}>
                Select a category…
              </option>
              {(categories as CatShape[]).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1.5 text-xs" style={{ color: "var(--warning)" }}>
                No categories found.{" "}
                <Link href="/categories" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                  Create one first
                </Link>
                .
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <button
              type="submit"
              className="w-full rounded-lg py-2.5 text-sm font-semibold transition-colors"
              style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
