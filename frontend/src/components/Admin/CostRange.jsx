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
import CancelIcon from "@mui/icons-material/Cancel";

// SEO Component to add meta tags
const SEO = () => (
  <>
    <title>Cost Range Configuration</title>
    <meta
      name="description"
      content="Configure cost ranges and tax per unit for energy billing. Manage unit ranges, costs, and taxes efficiently."
    />
    <meta
      name="keywords"
      content="cost range, energy billing, tax per unit, unit range, admin panel"
    />
    <meta name="author" content="TechAsia Mechatronics Pvt Ltd" />
  </>
);

// Unit range options
const range = [
  { value: 100, label: "0-100" },
  { value: 300, label: "101-300" },
  { value: 500, label: "301-500" },
  { value: 1000, label: "501-1000" },
];

// Table Header Component
const TableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell align="center" className="dark:text-white">
        Unit
      </TableCell>
      <TableCell align="center" className="dark:text-white">
        Cost
      </TableCell>
      <TableCell align="center" className="dark:text-white">
        Tax Per Unit
      </TableCell>
    </TableRow>
  </TableHead>
);

// Table Row Component
const TableRowComponent = ({ row, index, handleChange, theme }) => (
  <TableRow key={index}>
    <TableCell align="center">
      <TextField
        select
        label="Select Unit Range"
        className="w-52 bg-transparent dark:text-white dark:border-white"
        value={row.unitRange}
        onChange={(e) => handleChange(e, index, "unitRange")}
        sx={{
          border: theme === "dark" ? "1px solid white" : "1px solid black",
        }}
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
        className="w-52 bg-transparent dark:text-white dark:border-white"
        onChange={(e) => handleChange(e, index, "cost")}
        sx={{
          border: theme === "dark" ? "1px solid white" : "1px solid black",
        }}
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
        className="w-52 bg-transparent dark:text-white"
        onChange={(e) => handleChange(e, index, "taxPerUnit")}
        sx={{
          border: theme === "dark" ? "1px solid white" : "1px solid black",
        }}
        InputLabelProps={{
          className: "dark:text-white",
        }}
        InputProps={{
          className: "dark:text-white",
        }}
      />
    </TableCell>
  </TableRow>
);

// Main Component
const CostRangePage = () => {
  const state = useSelector((state) => state.bill?.state);
  const theme = useSelector((state) => state.theme?.mode);
  const dispatch = useDispatch();

  const [rows, setRows] = useState([
    { unitRange: "", cost: "", taxPerUnit: "" },
    { unitRange: "", cost: "", taxPerUnit: "" },
    { unitRange: "", cost: "", taxPerUnit: "" },
    { unitRange: "", cost: "", taxPerUnit: "" },
  ]);

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e, index, field) => {
    const selectedValue = e.target.value;
    const updatedRows = [...rows];
    updatedRows[index][field] = selectedValue;
    setRows(updatedRows);
  };

  // Handle form submission
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
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/range-dets`,
          rowData,
          { withCredentials: true }
        )
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
    <div className="flex flex-col justify-center items-center dark:text-white lg:p-40 pt-20">
      <SEO /> {/* Add SEO meta tags */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeButton
      />
      <CancelIcon
        className="absolute top-10 lg:top-20 right-1 lg:right-[10%] cursor-pointer"
        color="error"
        onClick={() => dispatch(costRangePage())}
        fontSize="large"
      />
      <TableContainer className="lg:flex lg:justify-center w-1/2">
        <Table
          sx={{
            maxWidth: 900,
            borderCollapse: "collapse",
            boxShadow: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "transparent",
            "& .MuiTableCell-root": {
              color: "black",
            },
            ".dark & .MuiTableCell-root": {
              color: "white",
            },
          }}
          aria-label="cost range table"
        >
          <TableHeader />
          <TableBody>
            {rows.map((row, index) => (
              <TableRowComponent
                key={index}
                row={row}
                index={index}
                handleChange={handleChange}
                theme={theme}
              />
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
            className="w-44 h-9 text-xl dark:text-white hover:bg-slate-600"
            sx={{
              backgroundColor: theme === "dark" ? "black" : "",
              color: theme === "dark" ? "white" : "black",
              border: `1px solid ${theme === "dark" ? "white" : "black"}`,
            }}
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
