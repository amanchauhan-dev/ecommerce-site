import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

const TableSkeleton: React.FC<{ colSpan: number }> = ({ colSpan }) => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((e) => {
        return (
          <TableRow key={e}>
            <TableCell colSpan={colSpan}>
              <Skeleton className="h-12" />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default TableSkeleton;
