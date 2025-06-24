import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type DataTableBaseProps = {
  columns: string[];
  children: ReactNode;
  emptyStateIcon?: ReactNode;
  emptyStateMessage?: string;
  className?: string;
};

type DataTableProps = DataTableBaseProps & React.HTMLAttributes<HTMLDivElement>;

export const DataTable = ({ columns, children, className, ...spreadProps }: DataTableProps) => {
  return (
    <div className={cn('p-3 select-none overflow-x-auto', className)} {...spreadProps}>
      {/* Table header */}
      <div className={cn('grid gap-2 text-xs text-muted-foreground mb-2 px-2', `grid-cols-${columns.length}`)}>
        {columns.map((column, index) => (
          <div key={index} className="truncate">
            {column}
          </div>
        ))}
      </div>

      {/* Table content */}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

type DataTableRowBaseProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

type DataTableRowProps = DataTableRowBaseProps & React.HTMLAttributes<HTMLDivElement>;

export const DataTableRow = ({ children, onClick, className, ...spreadProps }: DataTableRowProps) => {
  return (
    <div
      className={cn('grid gap-2 text-xs py-2 px-2 hover:bg-muted/50 rounded cursor-pointer', className)}
      onClick={onClick}
      {...spreadProps}
    >
      {children}
    </div>
  );
};

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
}

export const EmptyState = ({ icon, message }: EmptyStateProps) => {
  const defaultIcon = (
    <svg className="!w-[64px] !h-[64px]" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.5" d="M84 28H64V8l20 20z" fill="#AEB4BC" />
      <path
        opacity="0.2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 8h40v20h20v60H24V8zm10 30h40v4H34v-4zm40 8H34v4h40v-4zm-40 8h40v4H34v-4z"
        fill="#AEB4BC"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.137 64.105c7.828 5.781 18.916 5.127 26.005-1.963 7.81-7.81 7.81-20.474 0-28.284-7.81-7.81-20.474-7.81-28.284 0-7.09 7.09-7.744 18.177-1.964 26.005l-14.3 14.3 4.243 4.243 14.3-14.3zM43.9 57.9c-5.467 5.468-14.331 5.468-19.799 0-5.467-5.467-5.467-14.331 0-19.799 5.468-5.467 14.332-5.467 19.8 0 5.467 5.468 5.467 14.332 0 19.8z"
        fill="#AEB4BC"
      />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      {icon || defaultIcon}
      <p>{message}</p>
    </div>
  );
};
