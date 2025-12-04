// src/app/signup/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const router = useRouter();

  async function handle(e) {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      const j = await res.json();
      alert(j?.error || 'Signup failed');
    }
  }

  return (
    <div className="card max-w-md">
      <h2 className="text-lg font-semibold">Signup</h2>
      <form className="mt-4 space-y-3" onSubmit={handle}>
        <input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
        <button className="p-2 bg-green-600 text-white rounded">Create account</button>
      </form>
    </div>
  );
}
