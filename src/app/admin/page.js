// src/app/admin/page.js
import { getUserFromCookie } from '../../../lib';
import { createSupabaseServiceClient } from '../../../lib/supabaseServer';
import UserRow from '../../components/UserRow';

export default async function AdminPage() {
  const { user, profile } = await getUserFromCookie();
  if (!user) return <div className="card">Please <a href="/login" className="underline">login</a></div>;
  if (!profile?.is_admin) return <div className="card">Access denied</div>;

  const svc = createSupabaseServiceClient();
  // fetch profiles and combine with auth.users email via service client
  const { data: profiles } = await svc.from('profiles').select('*').order('created_at', { ascending: false });

  // fetch auth users (service role)
  const { data: authUsers } = await svc.auth.admin.listUsers();
  const usersMap = {};
  (authUsers || []).forEach(u => usersMap[u.id] = u.email);

  const enriched = (profiles || []).map(p => ({ ...p, email: usersMap[p.id] || null }));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Full name</th>
              <th className="p-2 text-left">Admin</th>
              <th className="p-2 text-left">Blocked</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.full_name}</td>
                <td className="p-2">{u.is_admin ? 'Yes' : 'No'}</td>
                <td className="p-2">{u.is_blocked ? 'Yes' : 'No'}</td>
                <td className="p-2 space-x-2">
                  <AdminButton path="/api/admin/block" label={u.is_blocked ? 'Unblock' : 'Block'} id={u.id} />
                  <AdminButton path="/api/admin/role" label={u.is_admin ? 'Revoke Admin' : 'Make Admin'} id={u.id} />
                  <AdminButton path="/api/admin/delete" label="Delete" id={u.id} danger />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminButton({ path, label, id, danger }) {
  return (
    <form action={path} method="post" className="inline" onSubmit={(e)=>{
      e.preventDefault();
      fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      .then(()=>location.reload()).catch(()=>alert('Action failed'));
    }}>
      <button type="submit" className={`underline ${danger ? 'text-red-600' : ''}`}>{label}</button>
    </form>
  );
}
