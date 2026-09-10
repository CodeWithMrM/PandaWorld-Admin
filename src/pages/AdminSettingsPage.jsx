import { useState } from 'react';
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { FloatingField, Label } from '@/components/ui/input';
import { useSettingsStore } from '@/store/settingsStore';

export function AdminSettingsPage() {
  const settings = useSettingsStore();
  const [form, setForm] = useState({
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    freeShippingThreshold: settings.freeShippingThreshold,
    standardShippingFee: settings.standardShippingFee,
    expressShippingFee: settings.expressShippingFee,
  });

  const handleField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    settings.update(form);
    toast.success('Settings saved (this browser only)');
  };

  return (
    <div>
      <PageHeader title="Settings" description="Store configuration and defaults." />

      <div className="mb-6 flex items-start gap-3 rounded-md border border-accent/30 bg-accent/5 p-4 text-sm text-ink/70">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p>
          The backend doesn't have a Settings model yet, so these values are saved to this
          browser only and won't sync across devices or affect the live storefront's shipping
          logic. Add a Settings model/endpoint to make these authoritative.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid max-w-xl grid-cols-1 gap-6">
        <section>
          <h3 className="mb-3 font-display text-base font-bold">Store Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FloatingField id="s-name" label="Store name" value={form.storeName} onChange={handleField('storeName')} />
            <FloatingField id="s-email" label="Support email" type="email" value={form.supportEmail} onChange={handleField('supportEmail')} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-display text-base font-bold">Shipping Defaults</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FloatingField id="s-threshold" label="Free shipping over (R)" type="number" value={form.freeShippingThreshold} onChange={handleField('freeShippingThreshold')} />
            <FloatingField id="s-standard" label="Standard fee (R)" type="number" value={form.standardShippingFee} onChange={handleField('standardShippingFee')} />
            <FloatingField id="s-express" label="Express fee (R)" type="number" value={form.expressShippingFee} onChange={handleField('expressShippingFee')} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-display text-base font-bold">Currency</h3>
          <Label className="mb-1.5 block">Store currency</Label>
          <p className="text-sm text-ink/60">South African Rand (ZAR) — set by PayFast integration, not editable here.</p>
        </section>

        <Button type="submit" variant="solid" size="lg" className="w-fit">
          Save Settings
        </Button>
      </form>
    </div>
  );
}
