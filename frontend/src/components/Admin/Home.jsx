import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";

const Home = () => {
  const [clientData, setClientData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const theme = useSelector((state) => state.theme.mode);

  const options = { withCredentials: true };

  const fetchClientData = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/getClientDets`,
        options
      );
      setClientData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
      toast.error("Error fetching data!");
    }
  }, []);

  React.useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const columnHelper = createColumnHelper();

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("phoneno", { header: "Phone No" }),
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("MACadd", { header: "MAC Address" }),
      columnHelper.accessor("voltage", {
        header: "Voltage",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("current", {
        header: "Current",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("watt", {
        header: "Watt",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("date_time", { header: "Date Time" }),
      columnHelper.accessor("state", { header: "State" }),
    ],
    []
  );

  const table = useReactTable({
    data: clientData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <div className="text-center py-10 dark:text-white">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="w-screen flex justify-center items-center">
      <div className="flex justify-center dark:text-white h-fit w-full mt-10 ">
        <ToastContainer />
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            border: theme === "dark" ? "1px solid white" : "1px solid black",
          }}
          className="dark:text-white"
        >
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        align="right"
                        sx={{
                          background: theme === "dark" ? "#030712" : "#e2e8f0",
                          color: theme === "dark" ? "white" : "black",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow hover key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        align="right"
                        className="dark:bg-gray-950 dark:text-white"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => table.setPageIndex(page)}
            onRowsPerPageChange={(e) =>
              table.setPageSize(Number(e.target.value))
            }
            sx={{
              backgroundColor: theme === "dark" ? "#030712" : "",
              color: theme === "dark" ? "white" : "black",
            }}
          />
        </Paper>
      </div>
    </div>
  );
};

export default Home;
