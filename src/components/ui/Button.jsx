import * as React from "react";

export const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
