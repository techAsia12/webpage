import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { billDetsPage } from "../../Features/pages/pages.slice";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import LoadingSpinner from "../LoadingSpinner";

// SEO Component to add meta tags
const SEO = () => (
  <>
    <title>Bill Details Management</title>
    <meta
      name="description"
      content="Manage and update bill details including state, base, percent per unit, and total tax percent."
    />
    <meta
      name="keywords"
      content="bill details, tax management, state billing, admin panel"
    />
    <meta name="author" content="Your Company Name" />
  </>
);

// Table Header Component
const TableHeader = ({ table, theme }) => (
  <TableHead>
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableCell
            key={header.id}
            sx={{
              background: theme === "dark" ? "#030712" : "",
              color: theme === "dark" ? "white" : "black",
            }}
            align="right"
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableHead>
);

// Table Body Component
const TableBodyContent = ({ table, theme, editingRowIndex, editedValues, setEditedValues, handleSave, handleCancel, handleEdit }) => (
  <TableBody>
    {table.getRowModel().rows.map((row) => (
      <TableRow hover key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className="dark:bg-gray-950 dark:text-white"
            align="right"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

// Main Component
const BillDets = () => {
  const [billDetails, setBillDetails] = React.useState([]);
  const [costDetails, setCostDetails] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [editingRowIndex, setEditingRowIndex] = React.useState(null);
  const [editedValues, setEditedValues] = React.useState({});
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  const options = {
    withCredentials: true,
  };

  // Fetch data from the API
  const fetchData = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/data-dets`,
        options
      );
      setBillDetails(response.data.data.billDetails);
      setCostDetails(response.data.data.costDetails);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
      toast.error("Error fetching data!");
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate unit range columns
  const unitRangeColumns = React.useMemo(() => {
    const unitRanges = new Set();
    costDetails.forEach((cost) => unitRanges.add(cost.unitRange));
    return Array.from(unitRanges).sort((a, b) => {
      if (!isNaN(a) && !isNaN(b)) return parseFloat(a) - parseFloat(b);
      return a.localeCompare(b);
    });
  }, [costDetails]);

  // Generate rows for the table
  const rows = React.useMemo(() => {
    const rows = [];
    billDetails.forEach((bill) => {
      const row = {
        state: bill.state,
        base: bill.base,
        percentPerUnit: bill.percentPerUnit,
        totalTaxPercent: bill.totalTaxPercent,
      };
      costDetails
        .filter((cost) => cost.state === bill.state)
        .forEach((cost) => {
          row[cost.unitRange] = cost.cost;
        });
      rows.push(row);
    });
    return rows;
  }, [billDetails, costDetails]);

  // Define table columns
  const columnHelper = createColumnHelper();
  const columns = React.useMemo(() => {
    const cols = [
      columnHelper.accessor("state", {
        header: "State",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("base", {
        header: "Base",
        cell: (info) => {
          const rowIndex = info.row.index;
          const isEditing = editingRowIndex === rowIndex;
          return isEditing ? (
            <input
              value={editedValues.base ?? info.getValue()}
              onChange={(e) =>
                setEditedValues((prev) => ({
                  ...prev,
                  base: e.target.value,
                }))
              }
              className="dark:bg-gray-950 dark:text-white w-full"
            />
          ) : (
            Number(info.getValue()).toFixed(2)
          );
        },
      }),
      columnHelper.accessor("percentPerUnit", {
        header: "Percent Per Unit",
        cell: (info) => {
          const rowIndex = info.row.index;
          const isEditing = editingRowIndex === rowIndex;
          return isEditing ? (
            <input
              value={editedValues.percentPerUnit ?? info.getValue()}
              onChange={(e) =>
                setEditedValues((prev) => ({
                  ...prev,
                  percentPerUnit: e.target.value,
                }))
              }
              className="dark:bg-gray-950 dark:text-white w-full"
            />
          ) : (
            Number(info.getValue()).toFixed(2)
          );
        },
      }),
      columnHelper.accessor("totalTaxPercent", {
        header: "Total Tax Percent",
        cell: (info) => {
          const rowIndex = info.row.index;
          const isEditing = editingRowIndex === rowIndex;
          return isEditing ? (
            <input
              value={editedValues.totalTaxPercent ?? info.getValue()}
              onChange={(e) =>
                setEditedValues((prev) => ({
                  ...prev,
                  totalTaxPercent: e.target.value,
                }))
              }
              className="dark:bg-gray-950 dark:text-white w-full"
            />
          ) : (
            Number(info.getValue()).toFixed(2)
          );
        },
      }),
    ];

    unitRangeColumns.forEach((unitRange) => {
      cols.push(
        columnHelper.accessor(unitRange.toString(), {
          header: unitRange.toString(),
          cell: (info) => {
            const rowIndex = info.row.index;
            const isEditing = editingRowIndex === rowIndex;
            const value = info.getValue();
            return isEditing ? (
              <input
                value={editedValues[unitRange] ?? value}
                onChange={(e) =>
                  setEditedValues((prev) => ({
                    ...prev,
                    [unitRange]: e.target.value,
                  }))
                }
                className="dark:bg-gray-950 dark:text-white w-full"
              />
            ) : value ? (
              Number(value).toFixed(2)
            ) : (
              "-"
            );
          },
        })
      );
    });

    cols.push(
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const rowIndex = info.row.index;
          const isEditing = editingRowIndex === rowIndex;
          return isEditing ? (
            <div className="space-y-2">
              <Button
                variant="contained"
                className="w-24 dark:bg-gray-950"
                sx={{
                  border:
                    theme === "dark" ? "1px solid white" : "1px solid black",
                }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="contained"
                className="w-24 dark:bg-gray-950"
                sx={{
                  border:
                    theme === "dark" ? "1px solid white" : "1px solid black",
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              className="dark:bg-gray-950 "
              sx={{
                border:
                  theme === "dark" ? "1px solid white" : "1px solid black",
              }}
              onClick={() => handleEdit(rowIndex)}
            >
              <EditIcon />
              Edit
            </Button>
          );
        },
      })
    );

    return cols;
  }, [unitRangeColumns, editingRowIndex, editedValues]);

  // Initialize the table
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handle edit action
  const handleEdit = (rowIndex) => {
    setEditingRowIndex(rowIndex);
    setEditedValues({ ...rows[rowIndex] });
  };

  // Handle save action
  const handleSave = async () => {
    if (editingRowIndex !== null) {
      try {
        const unitRanges = [];
        const costs = [];

        unitRangeColumns.forEach((unitRange) => {
          if (editedValues[unitRange] !== undefined) {
            unitRanges.push(unitRange);
            costs.push(editedValues[unitRange]);
          }
        });

        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/update-bill`,
          {
            ...editedValues,
            unitRanges,
            costs,
            state: editedValues.state,
          },
          options
        );

        toast.success("Data updated successfully!");
        fetchData();
        setEditingRowIndex(null);
      } catch (err) {
        toast.error("Failed to update data!");
      }
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedValues({});
  };

  // Handle add action
  const handleClick = () => {
    dispatch(billDetsPage());
  };

  // Loading and error states
  if (loading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="w-screen flex items-center ">
      <SEO /> {/* Add SEO meta tags */}
      <div className="flex justify-center dark:text-white h-fit w-full mt-20 lg:ml-40">
        <ToastContainer />
        <Paper
          sx={{
            width: "90%",
            overflow: "hidden",
            border: theme === "dark" ? "1px solid white" : "1px solid black",
          }}
          className=" dark:text-white"
        >
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader aria-label="bill details table">
              <TableHeader table={table} theme={theme} />
              <TableBodyContent
                table={table}
                theme={theme}
                editingRowIndex={editingRowIndex}
                editedValues={editedValues}
                setEditedValues={setEditedValues}
                handleSave={handleSave}
                handleCancel={handleCancel}
                handleEdit={handleEdit}
              />
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
            className="dark:bg-gray-950 dark:text-white"
          />
        </Paper>
      </div>
      <Button
        variant="contained"
        className="z-10 absolute transform -translate-y-72 right-20 dark:text-white dark:hover:bg-[#4963c7]"
        sx={{
          backgroundColor: theme === "dark" ? "#3f51b5" : "",
          border: theme === "dark" ? "1px solid white" : "1px solid black",
        }}
        onClick={handleClick}
      >
        <AddBoxIcon />
        Add
      </Button>
    </div>
  );
};

export default BillDets;