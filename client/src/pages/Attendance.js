import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect, useRef } from "react";
import Aside from "../components/Aside";
import Header from "../components/Header";
import {
  useAttendanceRecordsQuery,
  useMarkAttendanceMutation,
} from "../redux/api/attendanceApi";
import toast from "react-hot-toast";
import { BeatLoader, ScaleLoader } from "react-spinners";

const Attendance = () => {
  let todayDate = new Date();
  const formattedDate = todayDate.toISOString().slice(0, 10);

  const localStorageRef = useRef(formattedDate);

  const [date, setDate] = useState(localStorageRef.current);

  const { data, isError, isLoading, error } = useAttendanceRecordsQuery(date);

  if (isError) {
    toast.error(error.message);
  }

  const records = new Object(data);
  const studentInfo = records.data;

  const [markAttendance] = useMarkAttendanceMutation();

  const markAttendanceHandler = async (studentId) => {
    try {
      setButtonLoading({ ...buttonLoading, [studentId]: true });

      const res = await markAttendance({ studentId, date });

      if (date > formattedDate) {
        toast.error("Can not mark for future dates");
      }

      if (res.data.success) toast.success("Attendance recorded!");

      setButtonLoading({ ...buttonLoading, [studentId]: false });
    } catch (error) {
      toast.error("Failed to mark attendance");
      setButtonLoading({ ...buttonLoading, [studentId]: false });
    }
  };

  const [buttonLoading, setButtonLoading] = useState({});

  useEffect(() => {
    localStorageRef.current = date; // Update localStorageRef when date changes
    // Save the selected date to localStorage whenever it changes
    localStorage.setItem("selectedDate", date);
  }, [date]);

  useEffect(() => {
    const savedDate = localStorage.getItem("selectedDate");
    setDate(savedDate || formattedDate);
  }, [formattedDate]);

  return (
    <div className="container">
      <Aside />
      <div className="page">
        <Header />
        <div className="table-container">
          <div className="date">
            <h3>{date}</h3>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min="2024-03-20"
              max="2024-05-20"
            />
          </div>

          {isLoading ? (
            <ScaleLoader
              color="black"
              size={30}
              style={{ textAlign: "center" }}
            />
          ) : (
            <TableContainer component={Paper} className="table">
              <Table sx={{ minWidth: 600 }} aria-label="simple table">
                <TableHead className="table-head">
                  <TableRow className="table-row">
                    <TableCell className="table-cell" align="center">
                      Name
                    </TableCell>
                    <TableCell className="table-cell" align="center">
                      USN
                    </TableCell>
                    <TableCell className="table-cell" align="center">
                      Status
                    </TableCell>
                    <TableCell className="table-cell" align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentInfo &&
                    studentInfo.map((row, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {row.student.name}
                        </TableCell>
                        <TableCell align="center">{row.student.usn}</TableCell>
                        <TableCell align="center">{row.status}</TableCell>
                        <TableCell align="center">
                          <button
                            className="action-btn"
                            onClick={() =>
                              markAttendanceHandler(row.student._id)
                            }
                          >
                            {!buttonLoading[row.student._id] ? (
                              row.status === "absent" ? (
                                "Mark"
                              ) : (
                                "Unmark"
                              )
                            ) : (
                              <BeatLoader color="black" size={5} />
                            )}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
