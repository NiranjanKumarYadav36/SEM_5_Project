import React, { useState, useEffect } from "react";
import axios from "../../../components/Apiclient/axiosclient";
import { Box, Typography, Grid, Paper, Avatar, Button, Divider, TextField } from "@mui/material";
import { Visibility, EmojiNature, CheckCircle, CalendarToday, AccessTime } from "@mui/icons-material";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/footer";
import { Link } from "react-router-dom";

function UserProfile() {
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [observations, setObservations] = useState(0);
    const [species, setSpecies] = useState(0);
    const [identifications, setIdentifications] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bioMessage, setBioMessage] = useState("");
    const [joined_date, setJoindeDate] = useState("");
    const [last_active, setLastActive] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/user_profile");
                setUsername(response.data.data.username)
                setObservations(response.data.data.observations);
                setSpecies(response.data.data.species);
                setIdentifications(response.data.data.identifications);
                setBio(response.data.data.bio);
                setJoindeDate(response.data.data.date_joined);
                setLastActive(response.data.data.last_active);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Fetch once on mount

    const handleBioSubmit = async () => {
        setIsEditing(false);
        try {
            const response = await axios.post('/user_profile/update', { about: bio }); // Change to 'about' field
            setBioMessage("Bio submitted successfully!");
            console.log("Bio submitted successfully. Response:", response);
        } catch (error) {
            setBioMessage("Error submitting bio.");
            console.error("Error updating bio:", error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexShrink: 0 }}>
                <Navbar />
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: '2rem',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Paper sx={{ padding: '1rem' }}>
                            <Avatar
                                alt="Profile Picture"
                                src="/profile-pic.jpg"
                                sx={{ width: 100, height: 100, margin: 'auto' }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    marginBottom: '1rem',
                                    marginTop: '1rem',
                                    backgroundColor: '#337ab7',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#45a049',
                                    },
                                }}
                            >
                                Edit Account Settings & Profile
                            </Button>
                            <Divider sx={{ marginBottom: '1rem' }} />
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Visibility sx={{ marginRight: '0.5rem', color: '#4CAF50' }} />
                                        <Typography variant="body1">Observations</Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', backgroundColor: '#777', padding: '0.25rem 0.6rem', lineHeight: '0.9', borderRadius: '14px' }}>
                                        {loading ? '...' : observations}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EmojiNature sx={{ marginRight: '0.5rem', color: '#4CAF50' }} />
                                        <Typography variant="body1">Species</Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', backgroundColor: '#777', padding: '0.25rem 0.6rem', lineHeight: '0.9', borderRadius: '14px' }}>
                                        {loading ? '...' : species}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CheckCircle sx={{ marginRight: '0.5rem', color: '#4CAF50' }} />
                                        <Typography variant="body1">Identifications</Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white', backgroundColor: '#777', padding: '0.25rem 0.6rem', lineHeight: '0.9', borderRadius: '14px' }}>
                                        {loading ? '...' : identifications}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                        <Paper sx={{ padding: '2rem' }}>
                            <Typography variant="h5" gutterBottom>
                                {loading ? '...' : username}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ marginRight: '0.5rem', fontSize: 20 }} />
                                    <Typography variant="body2">{loading ? '...' : joined_date}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime sx={{ marginRight: '0.5rem', fontSize: 20 }} />
                                    <Typography variant="body2">{loading ? '...' : last_active}</Typography>
                                </Box>
                                <Link to="/home" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                    <Typography variant="body2">View WildSightings</Typography>
                                </Link>
                            </Box>

                            <Box sx={{ marginTop: '1rem' }}>
                                <Typography variant="h6">Bio</Typography>
                                {isEditing ? (
                                    <>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            variant="outlined"
                                            label="Your Bio"
                                            placeholder="Enter details about yourself"
                                            sx={{ marginBottom: '1rem' }}
                                        />
                                        <Button variant="contained" onClick={handleBioSubmit}>
                                            Submit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body1" color="textSecondary">
                                            {bio || "Please tell us about yourself."}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => setIsEditing(true)}
                                            sx={{ marginBottom: '1rem', marginTop: '1rem', backgroundColor: '#337ab7', color: 'white', '&:hover': { backgroundColor: '#45a049' } }}
                                        >
                                            Edit Bio
                                        </Button>
                                        {bioMessage && <Typography color="success.main">{bioMessage}</Typography>}
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ flexShrink: 0 }}>
                <Footer />
            </Box>
        </Box>
    );
}

export default UserProfile;
