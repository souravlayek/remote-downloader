import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";

const DataTable = ({ data, column, loading, title }) => {
  return (
    <Table>
      <TableCaption>{title}</TableCaption>
      <TableHeader>
        <TableRow>
          {column.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={column.length}>
              <Skeleton className="w-full" />
            </TableCell>
          </TableRow>
        ) : (
          <>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={column.length}>No data</TableCell>
              </TableRow>
            )}
            {data.map((file) => (
              <TableRow key={file.id}>
                {column.map((col) =>
                  col.render ? (
                    <TableCell key={col.key}>
                      {col.render(file[col.key])}
                    </TableCell>
                  ) : (
                    <TableCell key={col.key}>{file[col.key]}</TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
