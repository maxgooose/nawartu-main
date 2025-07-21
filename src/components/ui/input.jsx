import * as React from "react";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      {...props}
    />
  );
});
