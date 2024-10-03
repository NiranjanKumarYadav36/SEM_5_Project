import React, { useState, useEffect } from "react";
import {
    Box,
    CircularProgress,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Button,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Alert,
} from "@mui/material";
import { ArrowBack, ArrowForward, Edit, Save } from "@mui/icons-material";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/footer";
import { useObservationData } from "../../../components/Loaders/EditObservationLoader/editobseravtionsloader";
import LoadingScreen from "../../../components/LoadingScreen/Loading";
import axiosclient from "../../../components/Apiclient/axiosclient"; // Import your axios client
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

interface ObservationsData {
    id: number;
    image: string;
    common_name: string;
    scientific_name: string;
    category: string | { name: string };
    no_identification_agreement: number;
    no_identification_disagreement: number;
    description: string;
    location: string;
    state: string;
}

// Define predefined categories
const categories = [
    { name: "Amphibia" },
    { name: "Actinopterygii" },
    { name: "Aves" },
    { name: "Plantae" },
    { name: "Mollusca" },
    { name: "Mammalia" },
    { name: "Protozoa" },
    { name: "Insecta" },
    { name: "Arachnida" },
    { name: "Reptilia" },
];

// Edit Form Component
function EditObservationForm({ observation, onSave, onCancel }: { observation: ObservationsData; onSave: (obs: ObservationsData) => void; onCancel: () => void; }) {
    const initialCategory = typeof observation.category === "object" ? observation.category.name : observation.category;

    const [formData, setFormData] = useState<ObservationsData>({
        ...observation,
        category: initialCategory,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setFormData({ ...formData, category: event.target.value as string });
    };

    const saveObservation = async () => {
        try {
            const response = await axiosclient.post(`/edit_observation`, formData);
            console.log("Save successful:", response.data);
            onSave(response.data); // Pass the updated observation back to the parent component
        } catch (error) {
            console.error("Error occurred while saving:", error);
        }
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: 600, margin: "auto" }}>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>Edit Observation</Typography>
            <form noValidate autoComplete="off">
                <TextField
                    fullWidth
                    label="Common Name"
                    name="common_name"
                    value={formData.common_name}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Scientific Name"
                    name="scientific_name"
                    value={formData.scientific_name}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.name} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                        onClick={saveObservation} // Call saveObservation here
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default function EditObservations() {
    const { data, loading, error, loadPage, hasMore, page } = useObservationData();
    const [observations, setObservations] = useState<ObservationsData[]>(data); // Initialize state with data
    const [selectedObservation, setSelectedObservation] = useState<ObservationsData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        setObservations(data); // Update observations when data changes
    }, [data]);

    const handleNextPage = () => {
        if (hasMore) {
            loadPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            loadPage(page - 1);
        }
    };

    const handleEditClick = (observation: ObservationsData) => {
        setSelectedObservation(observation);
        setIsEditing(true);
    };

    const handleSave = (updatedObservation: ObservationsData) => {
        // Update the local state with the updated observation
        setObservations((prevObservations) =>
            prevObservations.map((obs) => (obs.id === updatedObservation.id ? updatedObservation : obs))
        );
        setIsEditing(false);
        setSelectedObservation(null);
        setSnackbarMessage("Observation updated successfully!");
        setSnackbarOpen(true);
        navigate("/observation/edit"); // Redirect to ediobservations
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedObservation(null);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading && observations.length === 0) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const startingRank = (page - 1) * 10 + 1;

    return (
        <Box sx={{ overflowY: "auto", maxHeight: "100vh" }}>
            <Navbar />
            {isEditing && selectedObservation ? (
                <EditObservationForm
                    observation={selectedObservation}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <Box sx={{ padding: "20px", textAlign: "center" }}>
                    <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                        User Observations
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {observations.slice(0, 10).map((observation: ObservationsData) => (
                            <Grid item key={observation.id} xs={12} sm={6} md={4} lg={3}>
                                <Card sx={{ maxWidth: 345, margin: "auto", position: "relative" }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={observation.image}
                                        alt={observation.common_name}
                                    />
                                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {observation.common_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left" }}>
                                            {`Scientific Name: ${observation.scientific_name}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left", marginTop: "5px" }}>
                                            {`Category: ${observation.category}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left", marginTop: "5px" }}>
                                            {`Agree: ${observation.no_identification_agreement}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left", marginTop: "5px" }}>
                                            {`Disagree: ${observation.no_identification_disagreement}`}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        size="small"
                                        sx={{ position: "absolute", bottom: 8, right: 8 }}
                                        startIcon={<Edit />}
                                        onClick={() => handleEditClick(observation)}
                                    >
                                        Edit
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            {!isEditing && (
                <>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                        <IconButton onClick={handlePreviousPage} disabled={page === 1 || loading} sx={{ color: !hasMore ? "grey.500" : "primary.main" }}>
                            <ArrowBack />
                        </IconButton>
                        <Typography sx={{ margin: "0 20px", fontWeight: "bold", color: "primary.main" }}>
                            Page {page}
                        </Typography>
                        {loading && <CircularProgress size={24} sx={{ margin: "0 20px" }} />}
                        <IconButton onClick={handleNextPage} disabled={!hasMore || loading} sx={{ color: !hasMore ? "grey.500" : "primary.main" }}>
                            <ArrowForward />
                        </IconButton>
                    </Box>
                    <Box sx={{ textAlign: "center", marginTop: "10px" }}>
                        <Typography variant="caption">
                            {`Showing ${startingRank} to ${startingRank + observations.slice(0, 10).length - 1} identifications`}
                        </Typography>
                    </Box>
                </>
            )}
            <Footer />
            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
