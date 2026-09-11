import { useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { useAuthStore } from '@/store/authStore';
import { PageSpinner } from './LoadingSpinner';
import { AccessDeniedPage } from '@/pages/AccessDeniedPage';

function AdminGate({ children }) {
  const { isLoaded: clerkLoaded } = useAuth();
  const { currentUser, isLoading, hasFetched, loadCurrentUser } = useAuthStore();

  // Wait for Clerk to finish loading AND have registered the token getter
  // before attempting to call /auth/me
  useEffect(() => {
    if (clerkLoaded && !hasFetched) {
      loadCurrentUser();
    }
  }, [clerkLoaded, hasFetched, loadCurrentUser]);

  if (!clerkLoaded || isLoading) return <PageSpinner />;

  if (currentUser?.role !== 'ADMIN') {
    // Note: unlike the storefront's AdminRoute (which redirects non-admins
    // to '/'), this standalone app's '/' IS the admin dashboard, so
    // redirecting there would loop. Show an explicit access-denied screen
    // instead.
    return <AccessDeniedPage />;
  }

  return children;
}

export function AdminRoute({ children }) {
  return (
    <>
      <SignedIn>
        <AdminGate>{children}</AdminGate>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
