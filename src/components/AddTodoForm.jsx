// src/components/AddTodoForm.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due_date, setDueDate] = useState('');
  const router = useRouter();

  async function handle(e) {
    e.preventDefault();
    const res = await fetch('/api/todos/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, due_date }),
    });
    if (res.ok) {
      setTitle(''); setDescription(''); setDueDate('');
      router.refresh();
    } else {
      alert('Create failed');
    }
  }

  return (
    <form className="space-y-2" onSubmit={handle}>
      <input required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
      <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
      <input type="date" value={due_date} onChange={(e)=>setDueDate(e.target.value)} className="w-full p-2 border rounded" />
      <div>
        <button className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
      </div>
    </form>
  );
}
