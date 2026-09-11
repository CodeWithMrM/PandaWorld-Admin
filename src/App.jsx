import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import { registerAuthTokenGetter } from '@/lib/api';
import { AdminRoute } from '@/components/common/AdminRoute';
import { AdminLayout } from '@/pages/AdminLayout';
import { SignInPage } from '@/pages/SignInPage';

import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/AdminProductsPage';
import { AdminCategoriesPage } from '@/pages/AdminCategoriesPage';
import { AdminInventoryPage } from '@/pages/AdminInventoryPage';
import { AdminOrdersPage } from '@/pages/AdminOrdersPage';
import { AdminOrderDetailPage } from '@/pages/AdminOrderDetailPage';
import { AdminCustomersPage } from '@/pages/AdminCustomersPage';
import { AdminCustomerDetailPage } from '@/pages/AdminCustomerDetailPage';
import { AdminPromotionsPage } from '@/pages/AdminPromotionsPage';
import { AdminReviewsPage } from '@/pages/AdminReviewsPage';
import { AdminNotificationsPage } from '@/pages/AdminNotificationsPage';
import { AdminReportsPage } from '@/pages/AdminReportsPage';
import { AdminSettingsPage } from '@/pages/AdminSettingsPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';

/* function AuthBootstrap() {
  const { getToken } = useAuth();

  // Give the axios client a way to fetch a fresh Clerk session token on
  // every outgoing request.
  useEffect(() => {
    registerAuthTokenGetter(getToken);
  }, [getToken]);

  return null;
} 
*/

export default function App() {
  return (
    <>
      
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />

        <Route
          path="/"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="admins" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}
