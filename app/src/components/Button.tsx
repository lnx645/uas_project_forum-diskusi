import { cn } from "@sglara/cn";
import * as React from "react";

type ButtonProps = React.ComponentProps<"button"> & {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const variants = {
  default: [
    "bg-sky-600 text-white shadow-sm",
    "hover:bg-sky-700",
    "focus:ring-sky-600/20",
  ],

  secondary: [
    "bg-stone-100 text-stone-900",
    "hover:bg-stone-200",
    "focus:ring-stone-300",
  ],

  outline: [
    "border border-stone-300 bg-white text-stone-900",
    "hover:bg-stone-50",
    "focus:ring-stone-300",
  ],

  ghost: [
    "bg-transparent text-stone-700",
    "hover:bg-stone-100",
    "focus:ring-stone-300",
  ],

  destructive: [
    "bg-red-600 text-white",
    "hover:bg-red-700",
    "focus:ring-red-300",
  ],
};

export function Button({
  className,
  size = "md",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus:outline-none focus:ring-4",
        "disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    />
  );
}