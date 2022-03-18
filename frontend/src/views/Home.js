import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={2}
    >
      <Typography variant="h4" gutterBottom>
        Crewmeister Project
      </Typography>
      <Link to="/absences" style={{textDecoration:'None'}}>
        <Button variant="contained" color="primary">
          Absences
        </Button>
      </Link>
    </Box>
  );
}

export default Home;
