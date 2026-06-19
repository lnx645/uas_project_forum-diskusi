import { cn } from "@sglara/cn";
import * as React from "react";

type InputProps = React.ComponentProps<"input"> & {
  inputSize?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

export function Input({
  className,
  inputSize = "md",
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-[#babfc4] bg-white text-[#232629] outline-none transition",
        "placeholder:text-[#838c95]",
        "focus:border-sky-600 focus:ring-4 focus:ring-sky-600/15",
        "disabled:pointer-events-none disabled:opacity-50",
        sizes[inputSize],
        className
      )}
      {...props}
    />
  );
}