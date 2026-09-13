import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FloatingField, Label, Textarea } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { createProduct, updateProduct } from '@/services/products';

const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '' };

export function ProductFormDialog({ open, onOpenChange, categories, product, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId || product.category?.id || '',
      });
    } else {
      setForm(emptyForm);
    }
    setImageFile(null);
  }, [product, open]);

  const handleField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error('Name, price, and category are required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { ...form, imageFile };
      if (product) {
        await updateProduct(product.id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || 'Could not save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-5 md:p-8">
        <DialogTitle className="mb-6">{product ? 'Edit Product' : 'Create Product'}</DialogTitle>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FloatingField id="p-name" label="Product name" className="md:col-span-2" value={form.name} onChange={handleField('name')} />
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Description</Label>
            <Textarea value={form.description} onChange={handleField('description')} placeholder="Product description" />
          </div>
          <FloatingField id="p-price" label="Price (ZAR)" type="number" step="0.01" min="0" value={form.price} onChange={handleField('price')} />
          <FloatingField id="p-stock" label="Stock quantity" type="number" min="0" value={form.stock} onChange={handleField('stock')} />
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Category</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Product Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-ink/70"
            />
            {product?.imageUrl && !imageFile && (
              <img src={product.imageUrl} alt="" className="mt-3 h-20 w-16 rounded-sm object-cover" />
            )}
          </div>
          <Button type="submit" variant="solid" size="lg" className="md:col-span-2 mt-2" disabled={isSaving}>
            {isSaving ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
