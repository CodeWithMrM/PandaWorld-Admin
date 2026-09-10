import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { fetchUsers, deleteUserById } from '@/services/admin';
import { formatDate } from '@/lib/utils';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetchUsers({ page, limit: 10, role: 'CUSTOMER', search: search || undefined })
      .then((data) => {
        setCustomers(data.users);
        setMeta(data.meta);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserById(deletingCustomer.id);
      toast.success('Customer account deleted');
      setDeletingCustomer(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (c) => <span className="font-medium text-ink">{c.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (c) => c.phone || '—' },
    { key: 'joined', header: 'Joined', render: (c) => formatDate(c.createdAt) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <Link to={`/customers/${c.id}`} className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-ink" aria-label="View">
            <Eye className="h-4 w-4" />
          </Link>
          <button onClick={() => setDeletingCustomer(c)} className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-accent" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Customers" description="View and manage customer accounts." />

      <DataTable
        columns={columns}
        rows={customers}
        isLoading={isLoading}
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search customers…"
        emptyTitle="No customers found"
      />

      <ConfirmDialog
        open={Boolean(deletingCustomer)}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
        title="Delete this customer account?"
        description={`"${deletingCustomer?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete Account"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
