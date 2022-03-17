import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
// Ical implementation
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ICalendarLink from "react-icalendar-link";
// Calendar Imports
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { Box, Button, TextField, Typography } from "@mui/material";
// Alert Components
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import format from "date-fns/format";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const columns = [
  {
    name: "Member",
    selector: (row) => row.member,
    sortable: true,
  },
  {
    name: "Type",
    selector: (row) => row.type,
    sortable: true,
  },
  {
    name: "Period",
    selector: (row) => `${row.startDate} - ${row.endDate}`,
    sortable: true,
  },
  {
    name: "Member Note",
    selector: (row) => row.memberNote || "Not available",
  },
  {
    name: "Status",
    selector: (row) =>
      !row.confirmedAt && !row.rejectedAt
        ? "Requested"
        : row.confirmedAt && !row.rejectedAt
        ? "Confirmed"
        : !row.confirmedAt && row.rejectedAt
        ? "Rejected"
        : null,
    sortable: true,
  },
  {
    name: "Admitter Note",
    selector: (row) => row.admitterNote || "Not available",
    sortable: true,
  },
  {
    name: "iCal",
    cell: (row) => (
      <ICalendarLink
        event={{
          title: `${row.type} Appointment by Mr/Mrs ${row.member}`,
          description: `${row.admitterNote}`,
          startTime: Date.parse(row.startDate),
          endTime: Date.parse(row.endDate),
          location: "Rosenheimer Str. 141 h, 81671 München, Germany",
          attendees: [`${row.member} <${row.member}@world.com>`],
        }}
      >
        <CalendarMonthIcon />
      </ICalendarLink>
    ),
  },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Absences() {
  const [pending, setPending] = useState(true);
  const [absencesData, setAbsencesData] = useState([]);
  const [sizeData, setSizeData] = useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [type, setType] = React.useState("");

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleChangeStartDate = (newValue) => {
    const formatedStartDate = format(newValue, "yyyy-MM-dd");
    setStartDate(formatedStartDate);
  };
  const handleChangeEndDate = (newValue) => {
    const formatedEndDate = format(newValue, "yyyy-MM-dd");
    setEndDate(formatedEndDate);
  };

  const clearCalendarFilter = async () => {
    setStartDate(null);
    setEndDate(null);
    setType("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const absences = await axios(`http://localhost:4500/absences`);
          const members = await axios(`http://localhost:4500/members`);

        let absences_data = [];

        const absences_array = absences.data.absences;
        const members_array = members.data.members;

        absences_array.map((absence) => {
          const member = members_array.find(
            (member) => member.userId === absence.userId
          );
          const member_name = member.name;

          absences_data.push({
            ...absence,
            member: member_name,
          });
        });
        var size = Object.keys(absences_data).length;
        size ? setSizeData(size) : setSizeData(null);
        setAbsencesData(absences_data);

        setErrorMessage("");
        setIsError(false);
      } catch (error) {
        console.log(error);
        setErrorMessage(error.message);
        setIsError(true);
      }
    };
    try {
      fetchData();
      setPending(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const filteredData = absencesData.filter((item) =>
    !startDate && !endDate && !type
      ? true
      : !startDate && !endDate && type
      ? item.type === type
      : startDate && endDate && !type
      ? item.startDate >= startDate && item.endDate <= endDate
      : startDate && endDate && type
      ? item.startDate >= startDate &&
        item.endDate <= endDate &&
        item.type === type
      : true
  );

  return (
    <>
      <Snackbar open={isError} autoHideDuration={400}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      {sizeData ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={2}
        >
          <Typography variant="h6" gutterBottom>
            Absences in total <b>{sizeData}</b>
          </Typography>
        </Box>
      ) : (
        ""
      )}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={2}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/dd/yyyy"
            value={startDate}
            onChange={handleChangeStartDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="End Date"
            inputFormat="MM/dd/yyyy"
            value={endDate}
            onChange={handleChangeEndDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        {startDate && endDate && (
          <Button
            variant="contained"
            color="error"
            onClick={clearCalendarFilter}
          >
            Reset
          </Button>
        )}
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingBottom={2}
      >
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            name="type"
            fullWidth
            value={type}
            label="Type"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"sickness"}>sickness</MenuItem>
            <MenuItem value={"vacation"}>vacation</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DataTable
        title="Absences"
        columns={columns}
        data={filteredData}
        progressPending={pending}
        pagination
      />
    </>
  );
}

export default Absences;
