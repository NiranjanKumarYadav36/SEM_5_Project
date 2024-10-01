/* eslint-disable react/react-in-jsx-scope */
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/footer";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { peopleloader } from "../../../components/Loaders/CommunityLoader/PeopleLoader/peopleloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";

interface PeopleData {
  username: string;
  identifications: number;
  observations_count: number;
  last_active: string; // Date string format
}

export const People = () => {
  const { data, loading, error } = peopleloader();
  
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>; // Display error if loading fails
  }

  const renderTable = (tableData: PeopleData[], title: string, dataKey: keyof PeopleData) => (
    <TableContainer component={Paper} sx={{ minWidth: 210, margin: "0 10px" }}>
      <Typography variant="h6" align="center">{title}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>{title}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell >{row.username}</TableCell>
              <TableCell align="center">{row[dataKey]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Sorting function for date strings (descending order by date)
  const sortByDate = (a: PeopleData, b: PeopleData) => {
    return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
  };

  // Sorting the data for different categories
  const mostObservations = [...data].sort((a: PeopleData, b: PeopleData) => b.observations_count - a.observations_count);
  const mostIdentifiers = [...data].sort((a: PeopleData, b: PeopleData) => b.identifications - a.identifications);
  const mostRecentLogin = [...data].sort(sortByDate); // Sorting by most recent last_active date

  return (
    <Box sx={{maxHeight: "100vh", overflowY: "auto"}}>
      <Navbar />
      {/* Main Content */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        
        {/* Aligning Title and Search Box */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", margin:5 }}>
          <Typography variant="h3" sx={{ marginRight: "20px" }}>
            The people of WildInsights
          </Typography>
          <TextField label="Search people" variant="outlined" sx={{ marginRight: "10px", marginLeft: 20 }} />
          <Button variant="contained">Go</Button>
        </Box>

        {/* LeaderBoards Title */}
        <Typography variant="h3" sx={{ margin:5 }}>LeaderBoards</Typography>

        {/* Tables */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {renderTable(mostObservations, "Observations", "observations_count")}
          {renderTable(mostIdentifiers, "Identifications", "identifications")}
          {renderTable(mostRecentLogin, "Last Active", "last_active")} {/* Sorted by last_active */}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
