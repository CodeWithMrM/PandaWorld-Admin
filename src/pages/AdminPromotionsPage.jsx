import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Info } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FloatingField } from '@/components/ui/input';
import { usePromotionsStore } from '@/store/promotionsStore';

export function AdminPromotionsPage() {
  const { promotions, addPromotion, togglePromotion, removePromotion } = usePromotionsStore();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ code: '', value: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) {
      toast.error('Code and discount percentage are required');
      return;
    }
    addPromotion({ code: form.code.trim().toUpperCase(), type: 'percentage', value: Number(form.value), active: true });
    toast.success('Promotion created (local demo only)');
    setForm({ code: '', value: '' });
    setFormOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Promotions & Coupons"
        description="Create and manage discount codes."
        actions={
          <Button variant="solid" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> New Coupon
          </Button>
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-md border border-accent/30 bg-accent/5 p-4 text-sm text-ink/70">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p>
          The backend doesn't have a Coupon model yet, so promotions here are stored in this
          browser only — a working mockup of the intended UX. The storefront's cart page
          currently checks against two hardcoded demo codes. Extend the backend with a real
          Coupon model to make this fully functional and shared across devices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => (
          <div key={promo.id} className="rounded-md border border-border bg-white p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-display text-lg font-bold tracking-wide">{promo.code}</p>
                <p className="text-sm text-ink/55">{promo.value}% off order subtotal</p>
              </div>
              <Badge variant={promo.active ? 'success' : 'muted'}>{promo.active ? 'Active' : 'Paused'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-ink/60">
                <Switch checked={promo.active} onCheckedChange={() => togglePromotion(promo.id)} />
                {promo.active ? 'Enabled' : 'Disabled'}
              </label>
              <button
                onClick={() => {
                  removePromotion(promo.id);
                  toast('Promotion removed');
                }}
                className="rounded-full p-2 text-ink/40 transition-colors hover:bg-surface-muted hover:text-accent"
                aria-label="Delete promotion"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-sm p-8">
          <DialogTitle className="mb-6">New Coupon</DialogTitle>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <FloatingField id="promo-code" label="Coupon code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
            <FloatingField id="promo-value" label="Discount %" type="number" min="1" max="100" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
            <Button type="submit" variant="solid">Create Coupon</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
