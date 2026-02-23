import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import PageHeader from "./components/page-header";
import StatCard from "./components/stat-card";
import ChartCard from "./components/chart-card";
import BadgeStock from "./components/badge-stock";
import EmptyState from "./components/empty-state";
import StockBarChart from "./components/stock-bar-chart";
import CategoryPieChart from "./components/category-pie-chart";
import {
  Package,
  Tags,
  Archive,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

// ── Data fetching ──────────────────────────────────────────────────────────
const itemCount = await prisma.item.count();
const categoryCount = await prisma.category.count();
const stockAgg = await prisma.item.aggregate({ _sum: { stock: true } });
const totalStock = stockAgg._sum.stock ?? 0;

const inventoryValue = await prisma.item
  .findMany({ select: { price: true, stock: true } })
  .then((rows: { price: number; stock: number }[]) =>
    rows.reduce((sum, r) => sum + Number(r.price) * r.stock, 0)
  );

const categoriesWithItems = await prisma.category.findMany({
  include: { items: { select: { stock: true } } },
  orderBy: { name: "asc" },
});

type CatWithItems = { name: string; items: { stock: number }[] };

const barData = (categoriesWithItems as CatWithItems[])
  .map((c) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name,
    stock: c.items.reduce((s, i) => s + i.stock, 0),
  }))
  .sort((a, b) => b.stock - a.stock)
  .slice(0, 8);

const pieData = (categoriesWithItems as CatWithItems[])
  .map((c) => ({ name: c.name, value: c.items.length }))
  .filter((c) => c.value > 0);

type LowStockItem = { id: number; name: string; stock: number; category: { name: string } | null };

const lowStockItems = await prisma.item.findMany({
  where: { stock: { lte: 5 } },
  include: { category: true },
  orderBy: { stock: "asc" },
  take: 8,
});

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory health and key metrics."
        actions={
          <Link
            href="/items/new"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "var(--primary)",
              color: "var(--primary-fg)",
            }}
          >
            <PlusCircle size={15} />
            Add Item
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Items" value={itemCount} icon={Package} color="primary" />
        <StatCard label="Categories" value={categoryCount} icon={Tags} color="info" />
        <StatCard label="Total Stock" value={totalStock.toLocaleString()} icon={Archive} color="success" />
        <StatCard
          label="Inventory Value"
          value={`$${inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          color="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ChartCard
          title="Stock by Category"
          description="Total units per category"
          className="lg:col-span-3"
        >
          {barData.length > 0 ? (
            <StockBarChart data={barData} />
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
              No data available
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Items by Category"
          description="Distribution of items"
          className="lg:col-span-2"
        >
          {pieData.length > 0 ? (
            <CategoryPieChart data={pieData} />
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
              No data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Low Stock Alert */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="rounded-lg p-1.5"
              style={{ background: "var(--warning-subtle)", color: "var(--warning)" }}
            >
              <AlertTriangle size={15} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Low Stock Alerts
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Items with ≤ 5 units remaining
              </p>
            </div>
          </div>
          <Link
            href="/items"
            className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--primary)" }}
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {lowStockItems.length === 0 ? (
          <EmptyState
            title="All stocked up!"
            description="No items are running low right now."
            icon={<Archive size={28} />}
          />
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {(lowStockItems as LowStockItem[]).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-[var(--surface-raised)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="rounded-lg p-2 shrink-0"
                    style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
                  >
                    <Package size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                      {item.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {item.category?.name ?? "No category"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <BadgeStock stock={item.stock} />
                  <Link
                    href={`/items/${item.id}`}
                    className="text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--primary)" }}
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
