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
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { billDetsPage } from "../../Features/pages/pages.slice";

const columns = [
  { id: "state", label: "State", minWidth: 100 },
  {
    id: "base",
    label: "Base",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "percentPerUnit",
    label: "Percent Per Unit",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "totalTaxPercent",
    label: "Total Tax Percent",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

const BillDets = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [billDetails, setBillDetails] = React.useState([]);
  const [costDetails, setCostDetails] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [editingRowIndex, setEditingRowIndex] = React.useState(null);
  const [editedValues, setEditedValues] = React.useState({});
  const dispatch = useDispatch();

  const options = {
    withCredentials: true,
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/data-dets`,
        options
      );
      setBillDetails(response.data.data.billDetails);
      setCostDetails(response.data.data.costDetails);
      setLoading(false);

      if (
        response.data.data.billDetails.length === 0 &&
        response.data.data.costDetails.length === 0
      ) {
        toast.info("No data available.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
      toast.error("Error fetching data!");
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (rowIndex) => {
    setEditingRowIndex(rowIndex);
    setEditedValues({ ...billDetails[rowIndex] });
  };

  const handleSave = async () => {
    if (editingRowIndex !== null) {
      const updatedData = [...billDetails];
      const rowToUpdate = updatedData[editingRowIndex];

      updatedData[editingRowIndex] = { ...rowToUpdate, ...editedValues };

      const unitRanges = [];
      const costs = [];

      unitRangeColumns.forEach((unitRange) => {
        if (editedValues[unitRange] !== undefined) {
          unitRanges.push(unitRange);
          costs.push(editedValues[unitRange]);
        }
      });

      const state = updatedData[editingRowIndex].state;
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/update-bill`,
          {
            ...editedValues,
            unitRanges,
            costs,
            state,
          }
        );

        toast.success("Data updated successfully!");
        setBillDetails(updatedData);
        setEditingRowIndex(null);
      } catch (err) {
        toast.error("Failed to update data!");
      }
    }
  };

  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedValues({});
  };

  const handleChange = (e, columnId) => {
    setEditedValues({ ...editedValues, [columnId]: e.target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const rows = [];
  const unitRanges = new Set();

  billDetails.forEach((bill) => {
    costDetails.forEach((cost) => {
      if (bill.state === cost.state) {
        unitRanges.add(cost.unitRange);

        const existingRow = rows.find((row) => row.state === bill.state);
        if (existingRow) {
          existingRow[cost.unitRange] = cost.cost;
        } else {
          rows.push({
            state: bill.state,
            base: bill.base,
            percentPerUnit: bill.percentPerUnit,
            totalTaxPercent: bill.totalTaxPercent,
            tax: bill.tax,
            cost: bill.cost,
            taxPerUnit: bill.taxPerUnit,
            [cost.unitRange]: cost.cost,
          });
        }
      }
    });
  });

  const unitRangeColumns = Array.from(unitRanges).sort((a, b) => {
    if (!isNaN(a) && !isNaN(b)) {
      return parseFloat(a) - parseFloat(b);
    }
    return a.localeCompare(b);
  });

  const handleClick = () => {
    dispatch(billDetsPage());
  };

  return (
    <>
      <Button
        variant="contained"
        className="absolute transform lg:translate-x-[1500%] translate-x-[370%] translate-y-8 dark:bg-gray-800 dark:text-white"
        onClick={handleClick}
      >
        <AddBoxIcon />
        Add
      </Button>
      <div className="flex justify-center pt-16 dark:bg-gray-800 dark:text-white h-lvh">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeButton
        />
        <Paper sx={{ width: "90%", overflow: "hidden" }} className="dark:bg-gray-800 dark:text-white">
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      sx={{ background: "#e2e8f0" }}
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  {unitRangeColumns.map((unitRange) => (
                    <TableCell
                      sx={{ background: "#e2e8f0" }}
                      key={unitRange}
                      align="right"
                    >
                      {unitRange}
                    </TableCell>
                  ))}
                  <TableCell sx={{ background: "#e2e8f0" }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + unitRangeColumns.length + 1}
                      align="center"
                      className="dark:bg-gray-800 dark:text-white"
                    >
                      No data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.state}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align} className="dark:bg-gray-600 dark:text-white">
                              {editingRowIndex === rowIndex &&
                                column.id !== "state" ? (
                                <input
                                  className="text-right dark:bg-gray-600 dark:text-white"
                                  value={editedValues[column.id]}
                                  onChange={(e) => handleChange(e, column.id)}
                                />
                              ) : column.format && typeof value === "number" ? (
                                column.format(value)
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                        {unitRangeColumns.map((unitRange) => (
                          <TableCell key={unitRange} align="right" className="dark:bg-gray-600 dark:text-white">
                            {editingRowIndex === rowIndex ? (
                              <input
                                value={
                                  editedValues[unitRange] || row[unitRange]
                                }
                                onChange={(e) => handleChange(e, unitRange)}
                                className="text-right dark:bg-gray-600 dark:text-white"
                              />
                            ) : row[unitRange] ? (
                              row[unitRange].toFixed(2)
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        ))}
                        <TableCell align="center" className="dark:bg-gray-600 dark:text-white">
                          {editingRowIndex === rowIndex ? (
                            <div className="space-y-2">
                              <Button
                                variant="contained"
                                className="w-12"
                                onClick={handleSave}
                              >
                                Save
                              </Button>
                              <Button
                                variant="contained"
                                className="w-12"
                                onClick={handleCancel}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={() => handleEdit(rowIndex)}
                            >
                              <EditIcon />
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="dark:bg-gray-600 dark:text-white"
          />
        </Paper>
      </div>
    </>
  );
};

export default BillDets;
