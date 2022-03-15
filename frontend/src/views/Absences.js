import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ICalendarLink from "react-icalendar-link";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { TextField } from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box } from "@mui/material";

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
    selector: (row) => row.year,
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

function Absences() {
  const [pending, setPending] = useState(true);
  const [absencesData, setAbsencesData] = useState([]);
  const [sizeData, setSizeData] = useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };
  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
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
    };
    try {
      fetchData();
      setPending(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
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
      </Box>

      <DataTable
        title="Absences"
        columns={columns}
        data={absencesData}
        progressPending={pending}
        pagination
      />
    </>
  );
}

export default Absences;
