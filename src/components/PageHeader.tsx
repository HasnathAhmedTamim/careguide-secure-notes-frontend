import type { ReactNode } from 'react';
import { BackLink } from '@/components/BackLink';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  backTo?: string;
  backLabel?: string;
  breadcrumb?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  backTo,
  backLabel,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {backTo && backLabel && <BackLink to={backTo} label={backLabel} />}
      {breadcrumb && <p className="text-xs text-muted-foreground">{breadcrumb}</p>}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
    </div>
  );
}
