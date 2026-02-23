/**
 * Shared shape types for Prisma query results.
 * These are used because @prisma/client types require a live DB connection
 * to generate fully typed client code.
 */

export type ItemShape = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category?: CategoryShape | null;
  categoryId?: number;
};

export type CategoryShape = {
  id: number;
  name: string;
  description?: string | null;
};

export type CategoryWithCount = CategoryShape & {
  _count: { items: number };
};
