import { ShieldAlert } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export function AccessDeniedPage() {
  const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <ShieldAlert className="h-7 w-7 text-accent" />
      </div>
      <h1 className="font-display text-2xl font-bold text-ink">Access Denied</h1>
      <p className="max-w-sm text-sm text-ink/55">
        Your account doesn't have admin access to PandaWorld. If you believe this is a mistake,
        contact an existing admin to have your role updated.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Button variant="default" asChild>
          <a href={storefrontUrl}>Go to Storefront</a>
        </Button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
}
