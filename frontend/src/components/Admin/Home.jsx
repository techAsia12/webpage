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
import LoadingSpinner from "../LoadingSpinner";

// SEO Component to add meta tags
const SEO = () => (
  <>
    <title>Client Data Dashboard</title>
    <meta
      name="description"
      content="View and manage client data including phone numbers, emails, MAC addresses, and energy metrics."
    />
    <meta
      name="keywords"
      content="client data, energy metrics, dashboard, admin panel"
    />
    <meta name="author" content="Your Company Name" />
  </>
);

// Table Header Component with border-x
const TableHeader = ({ table, theme }) => (
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
              borderLeft: theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
              borderRight: theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
              '&:first-of-type': {
                borderLeft: theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
              },
              '&:last-of-type': {
                borderRight: theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
              }
            }}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableHead>
);

// Table Body Component
const TableBodyContent = ({ table }) => (
  <TableBody>
    {table.getRowModel().rows.map((row) => (
      <TableRow hover key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            align="right"
            className="dark:bg-gray-950 dark:text-white"
            sx={{
              borderLeft: "1px solid transparent",
              borderRight: "1px solid transparent"
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

// Main Component
const Home = () => {
  const [clientData, setClientData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const theme = useSelector((state) => state.theme.mode);

  const options = { withCredentials: true };

  // Fetch client data from the API
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

  // Define table columns based on SQL query
  const columnHelper = createColumnHelper();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("phoneno", { header: "Phone No" }),
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("role", { header: "Role" }),
      columnHelper.accessor("MACadd", { header: "MAC Address" }),
      columnHelper.accessor("voltage", {
        header: "Voltage (V)",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("current", {
        header: "Current (A)",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("units", {
        header: "Units (kWh)",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("watt", {
        header: "Power (W)",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("power_factor", {
        header: "Power Factor (λ)",
        cell: (info) => Number(info.getValue()).toFixed(2),
      }),
      columnHelper.accessor("totalCost", {
        header: "Total Cost",
        cell: (info) => `₹${Number(info.getValue()).toFixed(2)}`,
      }),
      columnHelper.accessor("costToday", {
        header: "Today's Cost",
        cell: (info) => `₹${Number(info.getValue()).toFixed(2)}`,
      }),
      columnHelper.accessor("threshold", {
        header: "Threshold",
        cell: (info) => `₹${Number(info.getValue()).toFixed(2)}`,
      }),
      columnHelper.accessor("date_time", { 
        header: "Date & Time",
        cell: (info) => new Date(info.getValue()).toLocaleString()
      }),
      columnHelper.accessor("state", { header: "State" }),
    ],
    []
  );

  // Initialize the table
  const table = useReactTable({
    data: clientData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Loading and error states
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="w-screen flex justify-center items-center">
      <SEO />
      <div className="flex justify-center dark:text-white h-fit w-full mt-10">
        <ToastContainer />
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            border: theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
            '& .MuiTableContainer-root': {
              '&::-webkit-scrollbar': {
                height: '10px',
                width: '10px',
              },
              '&::-webkit-scrollbar-track': {
                background: theme === 'dark' ? '#030712' : '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme === 'dark' ? '#4b5563' : '#888',
                borderRadius: '10px',
                '&:hover': {
                  background: theme === 'dark' ? '#6b7280' : '#555',
                },
              },
              scrollbarWidth: 'thin',
              scrollbarColor: theme === 'dark' ? '#4b5563 #030712' : '#888 #f1f1f1',
            },
          }}
          className="dark:text-white"
        >
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="client data table">
              <TableHeader table={table} theme={theme} />
              <TableBodyContent table={table} />
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
              borderTop: theme === "dark" ? "1px solid #374151" : "1px solid #d1d5db",
            }}
          />
        </Paper>
      </div>
    </div>
  );
};

export default Home;