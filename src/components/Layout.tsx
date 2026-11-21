import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  StickyNote,
  PlusCircle,
  Shield,
  Users,
  NotebookPen,
  LogOut,
  NotebookTabs,
  Megaphone,
  Tags,
  UserRound,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
  );

export function Layout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  if (!user) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-border bg-card/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link to="/login" className="flex items-center gap-2 font-serif text-lg font-semibold">
              <NotebookTabs className="size-5 text-primary" />
              CareGuide Notes
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/login"
                className={cn(
                  'rounded-md px-3 py-1.5',
                  location.pathname === '/login'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={cn(
                  'rounded-md px-3 py-1.5',
                  location.pathname === '/register'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                Register
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-10">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-card md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex h-full flex-col gap-5 p-4">
          <Link
            to={isAdmin ? '/admin' : '/dashboard'}
            className="flex items-center gap-2 px-2 font-serif text-lg font-semibold"
          >
            <NotebookTabs className="size-5 text-primary" />
            CareGuide Notes
          </Link>

          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {isAdmin ? (
              <>
                <NavSection label="Overview">
                  <NavLink to="/admin" className={linkClass} end>
                    <Shield className="size-4" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/profile" className={linkClass}>
                    <UserRound className="size-4" />
                    My Profile
                  </NavLink>
                </NavSection>

                <NavSection label="Notes">
                  <NavLink to="/notes" className={linkClass} end>
                    <StickyNote className="size-4" />
                    My Notes
                  </NavLink>
                  <NavLink to="/admin/notes" className={linkClass}>
                    <NotebookPen className="size-4" />
                    All Notes
                  </NavLink>
                </NavSection>

                <NavSection label="People">
                  <NavLink to="/admin/users" className={linkClass} end>
                    <Users className="size-4" />
                    Manage Users
                  </NavLink>
                  <NavLink to="/admin/interests" className={linkClass}>
                    <Tags className="size-4" />
                    Users by Interests
                  </NavLink>
                </NavSection>
              </>
            ) : (
              <>
                <NavSection label="Overview">
                  <NavLink to="/dashboard" className={linkClass}>
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/profile" className={linkClass}>
                    <UserRound className="size-4" />
                    My Profile
                  </NavLink>
                </NavSection>

                <NavSection label="Notes">
                  <NavLink to="/notes" className={linkClass} end>
                    <StickyNote className="size-4" />
                    My Notes
                  </NavLink>
                  <NavLink to="/notes/new" className={linkClass}>
                    <PlusCircle className="size-4" />
                    Create Note
                  </NavLink>
                </NavSection>
              </>
            )}

            <Separator />

            <NavSection label="Community">
              <NavLink to="/posts" className={linkClass}>
                <Megaphone className="size-4" />
                Public Posts
              </NavLink>
            </NavSection>
          </nav>

          <div className="space-y-3 rounded-lg border border-border bg-background p-3">
            <div>
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user.role}
              </Badge>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                toast.info('Signed out', 'Come back anytime.');
              }}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
