// src/components/UserRow.jsx
'use client';
export default function UserRow({ user }) {
  return (
    <tr className="border-t">
      <td className="p-2">{user.email || user.id}</td>
      <td className="p-2">{user.full_name || '-'}</td>
      <td className="p-2">{user.is_admin ? 'Yes' : 'No'}</td>
      <td className="p-2">{user.is_blocked ? 'Yes' : 'No'}</td>
    </tr>
  );
}
