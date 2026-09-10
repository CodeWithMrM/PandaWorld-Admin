import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { RoleBadge } from '@/components/admin/StatusBadge';
import { fetchUsers, updateUserRole } from '@/services/admin';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';

export function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingChange, setPendingChange] = useState(null); // { user, nextRole }
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetchUsers({ page, limit: 10, search: search || undefined })
      .then((data) => {
        setUsers(data.users);
        setMeta(data.meta);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await updateUserRole(pendingChange.user.id, pendingChange.nextRole);
      toast.success(`${pendingChange.user.name} is now ${pendingChange.nextRole === 'ADMIN' ? 'an admin' : 'a customer'}`);
      setPendingChange(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not update role');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (u) => <span className="font-medium text-ink">{u.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u) => <RoleBadge role={u.role} /> },
    { key: 'joined', header: 'Joined', render: (u) => formatDate(u.createdAt) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (u) =>
        u.id === currentUser?.id ? (
          <span className="text-xs text-ink/35">You</span>
        ) : u.role === 'ADMIN' ? (
          <button
            onClick={() => setPendingChange({ user: u, nextRole: 'CUSTOMER' })}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-accent hover:text-accent"
          >
            <ShieldOff className="h-3.5 w-3.5" /> Revoke Admin
          </button>
        ) : (
          <button
            onClick={() => setPendingChange({ user: u, nextRole: 'ADMIN' })}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Make Admin
          </button>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Users"
        description="Manage who has administrator access to PandaWorld's dashboard."
      />

      <DataTable
        columns={columns}
        rows={users}
        isLoading={isLoading}
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search users…"
        emptyTitle="No users found"
      />

      <ConfirmDialog
        open={Boolean(pendingChange)}
        onOpenChange={(open) => !open && setPendingChange(null)}
        title={pendingChange?.nextRole === 'ADMIN' ? 'Grant admin access?' : 'Revoke admin access?'}
        description={`"${pendingChange?.user.name}" will ${pendingChange?.nextRole === 'ADMIN' ? 'gain full access to this admin dashboard' : 'lose admin access and become a regular customer'}.`}
        confirmLabel={pendingChange?.nextRole === 'ADMIN' ? 'Grant Access' : 'Revoke Access'}
        isDestructive={pendingChange?.nextRole !== 'ADMIN'}
        onConfirm={handleConfirm}
        isLoading={isSaving}
      />
    </div>
  );
}
