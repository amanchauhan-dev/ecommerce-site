import { HTMLAttributes } from "react";

export interface PageGapProps extends HTMLAttributes<HTMLDivElement> {}

export const PageGap: React.FC<PageGapProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div className={`px-2 sm:px-10 lg:px-16 ${className}`} {...rest}>
      {children}
    </div>
  );
};