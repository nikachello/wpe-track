import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SPOTS_PER_COMPANY } from "@/utils/constants";

export const TableSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
          {[...Array(SPOTS_PER_COMPANY)].map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            <td className="p-4">
              <Skeleton className="h-6 w-32" />
            </td>
            {[...Array(SPOTS_PER_COMPANY)].map((_, colIndex) => (
              <td key={colIndex} className="p-4">
                <Skeleton className="h-8 w-full" />
              </td>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
