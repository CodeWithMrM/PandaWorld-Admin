import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FloatingField } from '@/components/ui/input';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/services/products';
import { formatDate } from '@/lib/utils';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetchCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => {
    setEditingCategory(null);
    setName('');
    setFormOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, name.trim());
        toast.success('Category updated');
      } else {
        await createCategory(name.trim());
        toast.success('Category created');
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      toast.success('Category deleted');
      setDeletingCategory(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete category — it may still have products assigned');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Category Name', render: (c) => <span className="font-medium text-ink">{c.name}</span> },
    { key: 'createdAt', header: 'Created', render: (c) => formatDate(c.createdAt) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => openEdit(c)} className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-ink" aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeletingCategory(c)} className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-accent" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your catalog into shoppable categories."
        actions={
          <Button variant="solid" onClick={openNew}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={filtered}
        isLoading={isLoading}
        page={1}
        totalPages={1}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories…"
        emptyTitle="No categories found"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm p-8">
          <DialogTitle className="mb-6">{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <FloatingField id="cat-name" label="Category name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" variant="solid" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Delete this category?"
        description={`"${deletingCategory?.name}" will be removed. This fails if products are still assigned to it.`}
        confirmLabel="Delete Category"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
