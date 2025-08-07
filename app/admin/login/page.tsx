import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage() {
  // If already authenticated, redirect to home
  if (await isAuthenticated()) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            MapVault Admin
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Sign in to manage your antique map collection
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}