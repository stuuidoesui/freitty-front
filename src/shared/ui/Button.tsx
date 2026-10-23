import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { buttonClass, buttonSizes, buttonVariants } from '@/shared/styles/button-styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export const Button = ({
  variant = 'outline',
  size = 'sm',
  className,
  type = 'button',
  ...props
}: ButtonProps) => {
  return <button type={type} className={cn(buttonClass(variant, size), className)} {...props} />;
};

export const ButtonLink = ({
  to,
  children,
  variant = 'outline',
  size = 'sm',
  className,
  ...props
}: {
  to: string;
  children: ReactNode;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>) => {
  return (
    <Link to={to} className={cn(buttonClass(variant, size), className)} {...props}>
      {children}
    </Link>
  );
};
