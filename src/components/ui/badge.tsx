import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium font-mono uppercase tracking-wide',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-ink-700',
        signal: 'bg-signal-100 text-signal-600',
        success: 'bg-route-100 text-route-600',
        alert: 'bg-alert-100 text-alert-600',
        dark: 'bg-ink-900 text-chalk-50',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
