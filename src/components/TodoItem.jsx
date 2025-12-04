// src/components/TodoItem.jsx
'use client';
import { useRouter } from 'next/navigation';

export default function TodoItem({ todo }) {
  const router = useRouter();

  async function toggle() {
    const res = await fetch(`/api/todos/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id }),
    });
    if (res.ok) router.refresh();
    else alert('Toggle failed');
  }

  async function remove() {
    if (!confirm('Delete todo?')) return;
    const res = await fetch(`/api/todos/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id }),
    });
    if (res.ok) router.refresh();
    else alert('Delete failed');
  }

  return (
    <div className="border-b py-2">
      <div className="flex justify-between items-start">
        <div>
          <div className={todo.completed ? 'line-through font-semibold' : 'font-semibold'}>{todo.title}</div>
          {todo.description && <div className="text-sm text-gray-600">{todo.description}</div>}
          {todo.due_date && <div className="text-xs text-gray-500">Due: {todo.due_date}</div>}
        </div>
        <div className="space-x-2">
          <button onClick={toggle} className="underline text-sm">{todo.completed ? 'Uncomplete' : 'Complete'}</button>
          <button onClick={remove} className="underline text-sm text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}
