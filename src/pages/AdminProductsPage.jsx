import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchProducts, fetchCategories, deleteProduct } from '@/services/products';
import { formatCurrency } from '@/lib/utils';

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetchProducts({ page, limit: 10, search: search || undefined })
      .then((data) => {
        setProducts(data.products);
        setMeta(data.meta);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      toast.success('Product deleted');
      setDeletingProduct(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete product');
    } finally {
      setIsDeleting(false);
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
    { key: 'price', header: 'Price', render: (p) => formatCurrency(p.price) },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) =>
        p.stock <= 0 ? (
          <Badge variant="ink">Sold Out</Badge>
        ) : p.stock <= 5 ? (
          <Badge variant="accentOutline">{p.stock} left</Badge>
        ) : (
          <span>{p.stock}</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (p) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => {
              setEditingProduct(p);
              setFormOpen(true);
            }}
            className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingProduct(p)}
            className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-accent"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description="Create, edit, and manage your product catalog."
        actions={
          <Button
            variant="solid"
            className="w-full md:w-auto"
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={products}
        isLoading={isLoading}
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search products…"
        emptyTitle="No products found"
        emptyMessage="Try a different search, or add your first product."
      />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        product={editingProduct}
        onSaved={load}
      />

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Delete this product?"
        description={`"${deletingProduct?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
