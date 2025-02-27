import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";  
import { useDispatch, useSelector } from "react-redux";
import { costRangePage } from "../../Features/pages/pages.slice";

const range = [
  { value: 100, label: "0-100" },
  { value: 300, label: "101-300" },
  { value: 500, label: "301-500" },
  { value: 1000, label: "501-1000" },
];

const CostRangePage = () => {
  const state = useSelector((state) => state.bill?.state);
  const dispatch = useDispatch();

  const [rows, setRows] = useState([
    { unitRange: "", cost: "", taxPerUnit: "" },
    { unitRange: "", cost: "", taxPerUnit: "" },
    { unitRange: "", cost: "", taxPerUnit: "" },
    { unitRange: "", cost: "", taxPerUnit: "" },
  ]);
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index, field) => {
    const selectedValue = e.target.value;
    const updatedRows = [...rows];
    updatedRows[index][field] = selectedValue;
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    setLoading(true);

    rows.forEach((row) => {
      const rowData = {
        unitRange: row.unitRange,
        cost: row.cost,
        taxPerUnit: row.taxPerUnit,
        state: state,
      };

      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/range-dets`, rowData)
        .then((res) => {
          if (res?.status === 200) {
            toast.success("Data submitted successfully!"); 
            dispatch(costRangePage()); 
          }
        })
        .catch((error) => {
          console.log(
            "Error sending data for this row:",
            error?.response?.data?.message
          );
          toast.error("Error submitting data!");  
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  return (
    <div className="w-screen h-fit lg:ml-20">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton />
      <TableContainer className="lg:flex lg:justify-center w-1/2">
        <Table
          sx={{
            maxWidth: 900,
            borderCollapse: "collapse",
            boxShadow: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "white",
            '& .MuiTableCell-root': {
              color: 'black',
            },
            '.dark & .MuiTableCell-root': {
              color: 'white',
            },
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" className="dark:text-white">Unit</TableCell>
              <TableCell align="center" className="dark:text-white">Cost</TableCell>
              <TableCell align="center" className="dark:text-white">Tax Per Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <TextField
                    select
                    label="Select Unit Range"
                    className="w-52 dark:bg-gray-700 dark:text-white dark:border-white"
                    value={row.unitRange}
                    onChange={(e) => handleChange(e, index, "unitRange")}
                    InputLabelProps={{
                      className: "dark:text-white",
                    }}
                    InputProps={{
                      className: "dark:text-white",
                    }}
                  >
                    {range.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                <TableCell align="center">
                  <TextField
                    label="Select Cost"
                    className="w-52 dark:bg-gray-700 dark:text-white dark:border-white"
                    onChange={(e) => handleChange(e, index, "cost")}
                    InputLabelProps={{
                      className: "dark:text-white",
                    }}
                    InputProps={{
                      className: "dark:text-white",
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  <TextField
                    label="Select Tax Per Unit"
                    className="w-52 dark:bg-gray-700 dark:text-white dark:border-white"
                    onChange={(e) => handleChange(e, index, "taxPerUnit")}
                    InputLabelProps={{
                      className: "dark:text-white",
                    }}
                    InputProps={{
                      className: "dark:text-white",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-10 w-full flex justify-center">
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Button
            variant="contained"
            className="border border-neutral-900 w-44 h-9 text-xl dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default CostRangePage;
