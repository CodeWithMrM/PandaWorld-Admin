import { SignIn } from '@clerk/clerk-react';

export function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6">
      <div className="text-center">
        <span className="font-display text-xl font-extrabold tracking-tightest text-ink">PANDAWORLDAPPAREL</span>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest2 text-ink/40">Admin Dashboard</p>
      </div>
      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          variables: {
            colorPrimary: '#111111',
            colorText: '#111111',
            colorBackground: '#FFFFFF',
            borderRadius: '12px',
            fontFamily: '"Inter", sans-serif',
          },
          elements: {
            card: 'shadow-none border border-[#E7E7E7]',
            formButtonPrimary: 'bg-[#111111] hover:bg-black/85 text-sm font-semibold normal-case',
            footerActionLink: 'text-[#111111]',
          },
        }}
      />
    </div>
  );
}
