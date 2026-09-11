import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth,
} from "@clerk/clerk-react";

import { registerAuthTokenGetter } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

import { PageSpinner } from "./LoadingSpinner";
import { AccessDeniedPage } from "@/pages/AccessDeniedPage";

function AdminGate({ children }) {
  const { isLoaded: clerkLoaded, isSignedIn, getToken } = useAuth();

  const { currentUser, isLoading, hasFetched, loadCurrentUser } =
    useAuthStore();

  useEffect(() => {
    if (!clerkLoaded || !isSignedIn) {
      return;
    }

    // Register the Clerk token BEFORE requesting /auth/me.
    registerAuthTokenGetter(getToken);

    if (!hasFetched) {
      loadCurrentUser();
    }
  }, [clerkLoaded, isSignedIn, getToken, hasFetched, loadCurrentUser]);

  if (!clerkLoaded || isLoading) {
    return <PageSpinner />;
  }

  if (!currentUser) {
    return <AccessDeniedPage />;
  }

  if (currentUser.role !== "ADMIN") {
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
