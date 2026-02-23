// app/items/page.tsx

import { prisma } from "../lib/prisma";
import Link from "next/link";
import type { ItemShape } from "../lib/types";
import PageHeader from "../components/page-header";
import BadgeStock from "../components/badge-stock";
import EmptyState from "../components/empty-state";
import { PlusCircle, Search, X, Package } from "lucide-react";

type SearchParams = {
  q?: string;
};

export default async function ItemsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  // 1) نقرأ searchParams من ال URL (مثلاً /items?q=phone)
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q?.trim() || "";

  // 2) نبني شرط البحث
  const where =
    searchQuery !== ""
      ? {
          name: {
            contains: searchQuery,
          },
        }
      : undefined;

  // 3) نجلب العناصر مع تطبيق شرط where (لو searchQuery فارغ → يرجع كل العناصر)
  const items = await prisma.item.findMany({
    where,
    orderBy: { id: "asc" },
    include: {
      category: true,
    },
  });

  const totalStock = (items as ItemShape[]).reduce((s, i) => s + i.stock, 0);
  const totalValue = (items as ItemShape[]).reduce((s, i) => s + Number(i.price) * i.stock, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Items"
        description="Manage and track your inventory items."
        actions={
          <Link
            href="/items/new"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            <PlusCircle size={15} />
            Add Item
          </Link>
        }
      />

      {/* Search bar */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <form className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              name="q"
              placeholder="Search items by name…"
              defaultValue={searchQuery}
              className="w-full rounded-lg pl-9 pr-4 py-2 text-sm transition-colors"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            Search
          </button>
          {searchQuery && (
            <Link
              href="/items"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <X size={14} /> Clear
            </Link>
          )}
        </form>
        {searchQuery && (
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            Results for <strong style={{ color: "var(--text)" }}>&quot;{searchQuery}&quot;</strong>
          </p>
        )}
      </div>

      {/* Summary bar */}
      {items.length > 0 && (
        <div
          className="flex flex-wrap gap-6 rounded-xl px-5 py-3"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Results</span>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Total Stock</span>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {totalStock.toLocaleString()} units
            </p>
          </div>
          <div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Total Value</span>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {/* Table or empty state */}
      {items.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No items found" : "No items yet"}
          description={
            searchQuery
              ? "Try adjusting your search terms."
              : "Create your first inventory item to get started."
          }
          icon={<Package size={28} />}
          action={
            !searchQuery && (
              <Link
                href="/items/new"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
                style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
              >
                <PlusCircle size={15} /> Add Item
              </Link>
            )
          }
        />
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-raised)" }}>
                  {["ID", "Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(items as ItemShape[]).map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      background: idx % 2 === 1 ? "var(--surface-raised)" : "var(--surface)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    className="transition-colors hover:bg-[var(--primary-subtle)]"
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      #{item.id}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>
                      {item.name}
                    </td>
                    <td className="px-4 py-3">
                      {item.category ? (
                        <Link
                          href={`/categories/${item.category.id}`}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-70"
                          style={{
                            background: "var(--primary-subtle)",
                            color: "var(--primary)",
                          }}
                        >
                          {item.category.name}
                        </Link>
                      ) : (
                        <span className="text-xs italic" style={{ color: "var(--text-subtle)" }}>
                          No category
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--text)" }}>
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeStock stock={item.stock} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/items/${item.id}`}
                        className="text-xs font-medium transition-opacity hover:opacity-70"
                        style={{ color: "var(--primary)" }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
