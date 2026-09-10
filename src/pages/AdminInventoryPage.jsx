import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchProducts, updateProduct } from '@/services/products';

export function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editValues, setEditValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    setIsLoading(true);
    // Fetches a larger page when filtering low-stock client-side, since the
    // backend doesn't support sorting/filtering by stock level yet.
    fetchProducts({ page: lowStockOnly ? 1 : page, limit: lowStockOnly ? 100 : 10, search: search || undefined })
      .then((data) => {
        const rows = lowStockOnly ? data.products.filter((p) => p.stock <= 5) : data.products;
        setProducts(rows);
        setMeta(lowStockOnly ? { totalPages: 1 } : data.meta);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [page, search, lowStockOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStockSave = async (product) => {
    const newStock = editValues[product.id];
    if (newStock === undefined || Number(newStock) === product.stock) return;
    setSavingId(product.id);
    try {
      await updateProduct(product.id, { stock: Number(newStock) });
      toast.success(`Stock updated for "${product.name}"`);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not update stock');
    } finally {
      setSavingId(null);
    }
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
            {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
          </div>
          <span className="font-medium text-ink line-clamp-1">{p.name}</span>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (p) => p.category?.name || '—' },
    {
      key: 'status',
      header: 'Status',
      render: (p) =>
        p.stock <= 0 ? (
          <Badge variant="ink">Out of Stock</Badge>
        ) : p.stock <= 5 ? (
          <Badge variant="accentOutline">Low Stock</Badge>
        ) : (
          <Badge variant="success">In Stock</Badge>
        ),
    },
    {
      key: 'stock',
      header: 'Stock Quantity',
      render: (p) => (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            className="h-9 w-20 px-2 text-center"
            value={editValues[p.id] ?? p.stock}
            onChange={(e) => setEditValues((v) => ({ ...v, [p.id]: e.target.value }))}
          />
          <Button
            size="sm"
            variant="default"
            onClick={() => handleStockSave(p)}
            disabled={savingId === p.id || Number(editValues[p.id] ?? p.stock) === p.stock}
          >
            {savingId === p.id ? '…' : 'Update'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Inventory" description="Monitor and update stock levels across your catalog." />

      <label className="mb-4 flex w-fit items-center gap-2.5 text-sm text-ink/70">
        <Checkbox checked={lowStockOnly} onCheckedChange={(v) => { setLowStockOnly(Boolean(v)); setPage(1); }} />
        <AlertTriangle className="h-4 w-4 text-accent" /> Show low stock only (5 or fewer units)
      </label>

      <DataTable
        columns={columns}
        rows={products}
        isLoading={isLoading}
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search products…"
        emptyTitle="No products found"
      />
    </div>
  );
}
