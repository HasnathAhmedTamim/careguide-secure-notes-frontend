import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const ADMIN_DEMO = {
  email: 'admin@careguide.test',
  password: 'admin123',
};

export function LoginPage() {
  const { login, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function signIn(nextEmail: string, nextPassword: string, asDemo = false) {
    setError('');
    setLoading(true);
    if (asDemo) setDemoLoading(true);
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
      setDemoLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await signIn(email, password);
  }

  const busy = loading || demoLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to CareGuide Notes to manage private notes and community posts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={busy}
          onClick={() => void signIn(ADMIN_DEMO.email, ADMIN_DEMO.password, true)}
        >
          {demoLoading ? <Loader2 className="animate-spin" /> : <Shield />}
          {demoLoading ? 'Signing in...' : 'Demo admin login'}
        </Button>

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
