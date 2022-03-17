import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
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
      <Link href="/absences">
        <Button variant="contained" color="primary">
          Absences
        </Button>
      </Link>
    </Box>
  );
}

export default Home;
