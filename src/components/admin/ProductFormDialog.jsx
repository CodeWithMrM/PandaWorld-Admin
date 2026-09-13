import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FloatingField, Label, Textarea } from '@/components/ui/input';
import { createProduct, updateProduct, uploadProductImage } from '@/services/products';

const emptyForm = { name: '', description: '', price: '', stock: '', categoryId: '' };

export function ProductFormDialog({ open, onOpenChange, categories, product, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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
    setUploadedImage(null);
    setUploadProgress(0);
    setIsUploading(false);
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
      if (isUploading) {
        toast.error('Wait for the image upload to finish');
        return;
      }
      const payload = uploadedImage
        ? { ...form, imageUrl: uploadedImage.url, imageFileId: uploadedImage.fileId }
        : form;
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

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const image = await uploadProductImage(file, setUploadProgress);
      setUploadedImage(image);
      toast.success('Image uploaded');
    } catch (err) {
      setUploadedImage(null);
      toast.error(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-5 md:p-8">
        <DialogTitle className="mb-6">{product ? 'Edit Product' : 'Create Product'}</DialogTitle>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FloatingField id="p-name" label="Product name" className="md:col-span-2" value={form.name} onChange={handleField('name')} required />
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Description</Label>
            <Textarea value={form.description} onChange={handleField('description')} placeholder="Product description" />
          </div>
          <FloatingField id="p-price" label="Price (ZAR)" type="number" step="0.01" min="0" value={form.price} onChange={handleField('price')} required />
          <FloatingField id="p-stock" label="Stock quantity" type="number" min="0" value={form.stock} onChange={handleField('stock')} />
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Category</Label>
            <select
              id="p-category"
              value={form.categoryId}
              onChange={handleField('categoryId')}
              required
              className="flex h-12 w-full rounded-sm border border-border bg-white px-4 text-sm font-medium text-ink transition-colors focus:border-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-not-allowed disabled:opacity-50"
              disabled={categories.length === 0}
            >
              <option value="">{categories.length === 0 ? 'No categories available' : 'Select a category'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1.5 text-xs text-accent">Create a category before adding a product.</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1.5 block">Product Image</Label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              disabled={isUploading || isSaving}
              className="block w-full text-sm text-ink/70"
            />
            <p className="mt-1.5 text-xs text-ink/60">JPEG, PNG, WebP, or GIF — maximum 5 MB.</p>
            {isUploading && <p className="mt-1.5 text-xs text-ink/70">Uploading image… {uploadProgress}%</p>}
            {(uploadedImage?.url || product?.imageUrl) && (
              <img src={uploadedImage?.url || product.imageUrl} alt="Product preview" className="mt-3 h-20 w-16 rounded-sm object-cover" />
            )}
          </div>
          <Button type="submit" variant="solid" size="lg" className="md:col-span-2 mt-2" disabled={isSaving || isUploading}>
            {isUploading ? 'Uploading Image…' : isSaving ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
