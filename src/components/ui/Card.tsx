import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('card', className)} {...props}>
      {children}
    </div>
  ),
);

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('card-header', className)} {...props}>
      {children}
    </div>
  ),
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('card-content', className)} {...props}>
      {children}
    </div>
  ),
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className, ...props }, ref) => (
    <h3 ref={ref} className={cn('card-title', className)} {...props}>
      {children}
    </h3>
  ),
);

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('card-description', className)} {...props}>
      {children}
    </p>
  ),
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
