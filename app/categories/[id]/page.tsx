import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/page-header";
import Breadcrumbs from "@/app/components/breadcrumbs";
import BadgeStock from "@/app/components/badge-stock";
import EmptyState from "@/app/components/empty-state";
import ChartCard from "@/app/components/chart-card";
import CategoryBarChart from "@/app/components/category-bar-chart";
import { ArrowLeft, Package, DollarSign, Archive, PlusCircle } from "lucide-react";

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

  type ItemShape = { id: number; name: string; description: string | null; price: number; stock: number; categoryId: number };

  const totalStock = (category.items as ItemShape[]).reduce((s, i) => s + i.stock, 0);
  const totalValue = (category.items as ItemShape[]).reduce((s, i) => s + Number(i.price) * i.stock, 0);

  const chartData = (category.items as ItemShape[])
    .map((i) => ({
      name: i.name.length > 10 ? i.name.slice(0, 10) + "…" : i.name,
      stock: i.stock,
      value: Number(i.price) * i.stock,
    }))
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title={category.name}
        description={category.description || "Category details and associated items."}
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Categories", href: "/categories" },
              { label: category.name },
            ]}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <ArrowLeft size={14} /> Back
            </Link>
            <Link
              href={`/items/new?categoryId=${category.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
              style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
            >
              <PlusCircle size={14} /> Add Item
            </Link>
          </div>
        }
      />

      {/* Summary + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stats */}
        <div
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Category Summary
          </h3>
          {[
            { icon: Package, label: "Items", value: category.items.length },
            { icon: Archive, label: "Total Stock", value: totalStock.toLocaleString() + " units" },
            {
              icon: DollarSign,
              label: "Total Value",
              value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="rounded-lg p-2 shrink-0"
                style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
              >
                <Icon size={14} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <ChartCard
          title="Stock per Item"
          description="Top items by stock quantity"
          className="lg:col-span-2"
        >
          {chartData.length > 0 ? (
            <CategoryBarChart data={chartData} />
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
              No items to chart
            </div>
          )}
        </ChartCard>
      </div>

      {/* Items */}
      {category.items.length === 0 ? (
        <EmptyState
          title="No items in this category"
          description="Add your first item to this category to get started."
          icon={<Package size={28} />}
          action={
            <Link
              href={`/items/new?categoryId=${category.id}`}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
            >
              <PlusCircle size={15} /> Add Item
            </Link>
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
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface-raised)",
                  }}
                >
                  {["Name", "Description", "Price", "Stock"].map((h) => (
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
                {(category.items as ItemShape[]).map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      background:
                        idx % 2 === 1 ? "var(--surface-raised)" : "var(--surface)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    className="transition-colors hover:bg-[var(--primary-subtle)]"
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>
                      <Link
                        href={`/items/${item.id}`}
                        className="hover:underline"
                        style={{ color: "var(--primary)" }}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td
                      className="px-4 py-3 text-xs max-w-xs truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.description || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--text)" }}>
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeStock stock={item.stock} />
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
