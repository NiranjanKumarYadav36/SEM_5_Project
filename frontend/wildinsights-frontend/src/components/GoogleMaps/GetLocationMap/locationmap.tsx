/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Box, TextField, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

// Define the LatLng interface
interface LatLng {
  lat: number;
  lng: number;
}

// Define the MarkerData interface
interface MarkerData {
  latitude: number;
  longitude: number;
  state: string;
  country: string;
  address: string;
}

// Define the props for the LocationMapPopup component
interface LocationMapPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MarkerData) => void;
}

const LocationMapPopup: React.FC<LocationMapPopupProps> = ({ open, onClose, onSave }) => {
  const [markerPosition, setMarkerPosition] = useState<LatLng>({
    lat: 20.5937, // Initial latitude
    lng: 78.9629, // Initial longitude
  });
  const [latitude, setLatitude] = useState<string>(markerPosition.lat.toString());
  const [longitude, setLongitude] = useState<string>(markerPosition.lng.toString());
  const [address, setAddress] = useState<string>(""); // State to store the address
  const [state, setState] = useState<string>(""); // State to store the state
  const [country, setCountry] = useState<string>(""); // State to store the country

  // Function to handle marker drag end event
  const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng?.toJSON();
    if (latLng) {
      setMarkerPosition({ lat: latLng.lat, lng: latLng.lng });
      setLatitude(latLng.lat.toString());
      setLongitude(latLng.lng.toString());
      await fetchAddress(latLng.lat, latLng.lng); // Fetch address on drag end
    }
  };

  // Function to fetch address from latitude and longitude
  const fetchAddress = async (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Your Google Maps API Key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address); // Set the first result as the address

        // Extracting state and country from the address components
        const addressComponents = data.results[0].address_components;
        let extractedState = "";
        let extractedCountry = "";

        addressComponents.forEach((component: any) => {
          if (component.types.includes("administrative_area_level_1")) {
            extractedState = component.long_name; // Extracting state
          }
          if (component.types.includes("country")) {
            extractedCountry = component.long_name; // Extracting country
          }
        });

        setState(extractedState); // Set the state
        setCountry(extractedCountry); // Set the country
      } else {
        setAddress("Address not found");
        setState("");
        setCountry("");
      }
    } else {
      setAddress("Error fetching address");
      setState("");
      setCountry("");
    }
  };

  // Handle input change for latitude and longitude
  const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(event.target.value);
  };

  // Function to move the marker to the entered latitude and longitude
  const moveMarkerToCoordinates = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition({ lat, lng });
      setLatitude(lat.toString());
      setLongitude(lng.toString());
      await fetchAddress(lat, lng); // Fetch address for the new position
    }
  };

  // Function to get the user's location
  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
          setLatitude(latitude.toString());
          setLongitude(longitude.toString());
          fetchAddress(latitude, longitude); // Fetch address for the user's location
        },
        (error) => {
          console.error("Error getting location:", error);
          setAddress("Unable to retrieve your location.");
          setState("");
          setCountry("");
        }
      );
    } else {
      setAddress("Geolocation is not supported by this browser.");
      setState("");
      setCountry("");
    }
  };

  // Save the location data and close the popup
  const handleSave = () => {
    onSave({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      state,
      country,
      address,
    });
    onClose(); // Close the popup
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Location Map</DialogTitle>
      <DialogContent>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Box sx={{ height: "400px", width: "100%", position: "relative" }}>
            <Map
              defaultZoom={5}
              defaultCenter={markerPosition} // Center the map on the marker
              mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
            >
              {/* Draggable Advanced Marker */}
              <AdvancedMarker
                position={markerPosition}
                title="Drag me!"
                draggable
                onDragEnd={handleMarkerDragEnd}
              />
            </Map>

            {/* Transparent floating text */}
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255, 255, 255, 0.7)",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 1000, // Ensures the text is above the map
                pointerEvents: "none", // Prevents interaction with the text
              }}
            >
              Drag the marker to your desired location
            </Typography>
          </Box>
          {/* Latitude and Longitude Inputs */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <TextField
              label="Latitude"
              variant="outlined"
              value={latitude}
              onChange={handleLatitudeChange}
              size="small"
            />
            <TextField
              label="Longitude"
              variant="outlined"
              value={longitude}
              onChange={handleLongitudeChange}
              size="small"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="contained" onClick={moveMarkerToCoordinates}>
                Move Marker
              </Button>
              <Button variant="contained" onClick={useMyLocation}>
                Use My Location
              </Button>
            </Box>
          </Box>

          {/* Display Address */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <TextField
              label="Address"
              variant="outlined"
              value={address} // Display the fetched address
              size="small"
              fullWidth
              InputProps={{
                readOnly: true, // Make the address field read-only
              }}
              sx={{ width: "300px" }} // Make the address box smaller
            />
          </Box>
        </APIProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Location</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationMapPopup;

