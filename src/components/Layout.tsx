import { Link, NavLink, Outlet } from 'react-router-dom';
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
  GitMerge,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
  );

export function Layout() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link to="/login" className="flex items-center gap-2 font-serif text-lg font-semibold">
              <NotebookTabs className="size-5 text-primary" />
              CareGuide Notes
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-10">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-border bg-card md:border-b-0 md:border-r">
        <div className="flex h-full flex-col gap-4 p-4">
          <Link to="/dashboard" className="flex items-center gap-2 px-2 font-serif text-lg font-semibold">
            <NotebookTabs className="size-5 text-primary" />
            CareGuide Notes
          </Link>

          <nav className="flex flex-col gap-1">
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard className="size-4" />
              Dashboard
            </NavLink>
            <NavLink to="/notes" className={linkClass} end>
              <StickyNote className="size-4" />
              My notes
            </NavLink>
            <NavLink to="/notes/new" className={linkClass}>
              <PlusCircle className="size-4" />
              New note
            </NavLink>
            <NavLink to="/posts" className={linkClass}>
              <Megaphone className="size-4" />
              Posts
            </NavLink>

            <Separator className="my-2" />
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Aggregations
            </p>
            <NavLink to="/aggregations/interests" className={linkClass}>
              <Tags className="size-4" />
              By interests
            </NavLink>
            <NavLink to="/aggregations/user-posts" className={linkClass}>
              <GitMerge className="size-4" />
              User posts
            </NavLink>

            {user.role === 'admin' && (
              <>
                <Separator className="my-2" />
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Admin
                </p>
                <NavLink to="/admin" className={linkClass} end>
                  <Shield className="size-4" />
                  Overview
                </NavLink>
                <NavLink to="/admin/users" className={linkClass}>
                  <Users className="size-4" />
                  Users
                </NavLink>
                <NavLink to="/admin/notes" className={linkClass}>
                  <NotebookPen className="size-4" />
                  All notes
                </NavLink>
              </>
            )}
          </nav>

          <div className="mt-auto space-y-3 rounded-lg border border-border bg-background p-3">
            <div>
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user.role}
              </Badge>
            </div>
            <Button variant="outline" className="w-full" onClick={logout}>
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
