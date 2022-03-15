import React, { useState, useEffect } from "react";

import DataTable from "react-data-table-component";
import axios from "axios";
import { Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";

// Member name
// Type of absence
// Period
// Member note (when available)
// Status (can be 'Requested', 'Confirmed' or 'Rejected')
// Admitter note (when available)

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
      <Button variant="contained" color="primary">
        <CalendarMonthIcon />
      </Button>
    ),
  },
];

function Absences() {
  const [pending, setPending] = useState(true);
  const [absencesData, setAbsencesData] = useState([]);
  const [sizeData, setSizeData] = useState(null);

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
        <Typography variant="h6" gutterBottom>
          Absences {sizeData}
        </Typography>
      ) : (
        ""
      )}

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
