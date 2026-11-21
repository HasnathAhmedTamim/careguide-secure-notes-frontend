import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Shield, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const DEMO_ACCOUNTS = [
  {
    key: 'admin',
    label: 'Admin demo',
    description: 'Manage users, all notes, interests',
    email: 'admin@careguide.test',
    password: 'admin123',
    icon: Shield,
  },
  {
    key: 'member',
    label: 'Member demo',
    description: 'Private notes and community posts',
    email: 'nabila@careguide.test',
    password: 'user1234',
    icon: UserRound,
  },
] as const;

export function LoginPage() {
  const { login, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  async function signIn(nextEmail: string, nextPassword: string, demoKey?: string) {
    setError('');
    setLoading(true);
    if (demoKey) setDemoLoading(demoKey);
    try {
      await login(nextEmail, nextPassword);
      toast.success('Welcome back', 'You are signed in successfully.');
      navigate('/dashboard');
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error('Login failed', message);
    } finally {
      setLoading(false);
      setDemoLoading(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await signIn(email, password);
  }

  async function onDemoLogin(account: (typeof DEMO_ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    await signIn(account.email, account.password, account.key);
  }

  const busy = loading || demoLoading !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to CareGuide Notes, or use a demo account for a quick review.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium">Demo access for recruiters</p>
          <div className="grid gap-2">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              const isThisLoading = demoLoading === account.key;
              return (
                <button
                  key={account.key}
                  type="button"
                  disabled={busy}
                  onClick={() => void onDemoLogin(account)}
                  className="flex w-full items-start gap-3 rounded-lg border border-border bg-background px-3 py-3 text-left transition-colors hover:bg-secondary disabled:opacity-60"
                >
                  <div className="mt-0.5 rounded-md bg-secondary p-2 text-secondary-foreground">
                    {isThisLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{account.label}</p>
                    <p className="text-xs text-muted-foreground">{account.description}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {account.email} / {account.password}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or sign in manually</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {loading && !demoLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
            {loading && !demoLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        No account?{' '}
        <Link to="/register" className="ml-1 font-medium text-primary hover:underline">
          Register
        </Link>
      </CardFooter>
    </Card>
  );
}
