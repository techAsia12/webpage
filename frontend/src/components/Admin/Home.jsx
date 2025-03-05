import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

const columns = [
  { id: "phoneno", label: "Phone No", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "MACadd", label: "MAC Address", minWidth: 150 },
  { id: "voltage", label: "Voltage", minWidth: 100, align: "right" },
  { id: "current", label: "Current", minWidth: 100, align: "right" },
  { id: "watt", label: "Watt", minWidth: 100, align: "right" },
  { id: "date_time", label: "Date Time", minWidth: 170 },
  { id: "state", label: "State", minWidth: 100 },
];

const HomePage = () => {
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const options = { withCredentials: true };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/getClientDets`,
          options
        );
        setClientData(response.data.data);
        console.log(clientData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchClientData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-center pt-16 dark:bg-gray-800 dark:text-white h-fit w-full">
        <Paper sx={{ width: "92%", overflow: "hidden" }} className="dark:bg-gray-800 dark:text-white z-0">
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{ background: '#e2e8f0' }}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clientData === null ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" className="dark:bg-gray-600 dark:text-white">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                clientData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} className="dark:bg-gray-600 dark:text-white">
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={10}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="dark:bg-gray-600 dark:text-white"
        />
      </Paper>
    </div>
  );
};

export default HomePage;
