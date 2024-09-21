import { Box } from "@mui/material";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import React from "react";

const center = { lat: 20.5937, lng:  78.9629 };

const Maps = () => {
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ height: "600px", width: "100%" }}>
      <GoogleMap
        center={center}
        zoom={4}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          streetViewControl:false,
          mapTypeControl:false,
        }}
      ></GoogleMap>
    </Box>
  );
};

export default Maps;
