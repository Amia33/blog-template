import type { TableHTMLAttributes } from "react";

export function MdxTable({
  className,
  ...rest
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={className} {...rest} />
    </div>
  );
}
