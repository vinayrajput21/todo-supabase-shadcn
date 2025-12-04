// src/app/dashboard/page.js
import { getUserFromCookie } from '../../../lib/auth';
import { createSupabaseServerWithAccessToken } from '../../../lib/supabaseServer';
import AddTodoForm from '../../components/AddTodoForm';
import TodoItem from '../../components/TodoItem';

export default async function DashboardPage() {
  const { user, profile, token } = await getUserFromCookie();
  if (!user) return redirectToLogin();

  const supabase = createSupabaseServerWithAccessToken(token);
  const today = (new Date()).toISOString().slice(0,10);

  const [{ data: todosToday }, { data: todosCompleted }, { data: todosPending }] = await Promise.all([
    supabase.from('todos').select('*').eq('user_id', user.id).lte('due_date', today).order('created_at', { ascending: false }),
    supabase.from('todos').select('*').eq('user_id', user.id).eq('completed', true).order('updated_at', { ascending: false }),
    supabase.from('todos').select('*').eq('user_id', user.id).eq('completed', false).order('due_date', { ascending: true }),
  ]);

  return (
    <div>
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="text-sm text-gray-600">Welcome {profile?.full_name || user.email}</div>
        </div>
        <div>
          <a href="/api/auth/logout" className="mr-3 underline">Logout</a>
          {profile?.is_admin && <a href="/admin" className="underline">Admin</a>}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Today's Todos</h3>
          {todosToday?.length ? todosToday.map(t => <TodoItem key={t.id} todo={t} />) : <div className="text-sm text-gray-500">No todos for today</div>}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Completed</h3>
          {todosCompleted?.length ? todosCompleted.map(t => <TodoItem key={t.id} todo={t} />) : <div className="text-sm text-gray-500">No completed todos</div>}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Pending</h3>
          {todosPending?.length ? todosPending.map(t => <TodoItem key={t.id} todo={t} />) : <div className="text-sm text-gray-500">No pending todos</div>}
        </div>
      </section>

      <section className="mt-6 card">
        <h3 className="font-semibold mb-2">Create Todo</h3>
        {/* AddTodoForm is a client component that posts to /api/todos/create */}
        <AddTodoForm />
      </section>
    </div>
  );
}

function redirectToLogin() {
  return (
    <div className="card">
      <h3 className="text-lg">Not authenticated</h3>
      <p className="mt-2">Please <a href="/login" className="underline">login</a>.</p>
    </div>
  );
}
