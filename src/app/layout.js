// src/app/layout.js
import '../app/globals.css';

export const metadata = {
  title: 'Todo - Supabase + Next.js',
  description: 'Todo app using Supabase and Next.js (App Router)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Todo App</h1>
            <nav>
              <a href="/" className="mr-4 underline">Home</a>
              <a href="/login" className="mr-4 underline">Login</a>
              <a href="/signup" className="underline">Signup</a>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="mt-8 text-sm text-gray-500">
            Built with Supabase + Next.js (App Router)
          </footer>
        </div>
      </body>
    </html>
  );
}
