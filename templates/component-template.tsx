import React from 'react';
import { cn } from '@/lib/utils';
import type { BaseComponentProps, VariantComponentProps } from '@/lib/types/component';

// コンポーネントのProps型定義
export interface ComponentNameProps extends VariantComponentProps {
  // 追加のプロパティをここに定義
  label?: string;
  description?: string;
}

// バリアントのクラス定義
const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
} as const;

// サイズのクラス定義
const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
} as const;

/**
 * ComponentName - コンポーネントの説明
 * 
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Button Text
 * </ComponentName>
 * ```
 */
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = 'default', size = 'default', children, label, description, ...props }, ref) => {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {label && <span className="sr-only">{label}</span>}
        {children}
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';

export default ComponentName; 