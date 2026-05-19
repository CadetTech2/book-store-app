import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { formatDate } from '@/utils';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({ page, limit: 10 });
      setUsers(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await userService.updateRole(userId, newRole);
      toast.success('Role updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async () => {
    try {
      await userService.delete(deleteId);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <Spinner className="py-32" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Manage Users</h1>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500 sm:hidden">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge color={u.role === 'admin' ? 'purple' : 'slate'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleRoleToggle(u.id, u.role)}>
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(u.id)} className="text-red-500">
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No users found</p>
        )}
      </div>

      <Pagination meta={meta} onPageChange={setPage} />

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">Are you sure you want to delete this user? All their data will be removed.</p>
      </Modal>
    </div>
  );
}
