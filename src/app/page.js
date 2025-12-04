// src/app/page.js
import { redirect } from 'next/navigation';
import { getUserFromCookie } from '../../lib/auth';

export default async function HomePage() {
  const { user } = await getUserFromCookie();
  if (user) return redirect('/dashboard');

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Welcome</h2>
      <p className="mt-2">Login or Signup to manage your todos.</p>
      <div className="mt-4">
        <a href="/login" className="inline-block mr-3 p-2 bg-blue-600 text-white rounded">Login</a>
        <a href="/signup" className="inline-block p-2 bg-gray-200 rounded">Sign up</a>
      </div>
    </div>
  );
}
