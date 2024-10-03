/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { APIProvider, Map, MapMouseEvent, Marker } from "@vis.gl/react-google-maps";

interface LatLng {
  lat: number;
  lng: number;
}

const LocationMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [clickedLocation, setClickedLocation] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reference to hold the map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  // Function to handle "Use Your Location" button click
  const handleUseLocation = () => {
    setLoading(true);
    setError(null); // Clear any previous error
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setLoading(false);
        },
        (err) => {
          console.error("Geolocation error: ", err);
          setError("Unable to retrieve location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Effect to handle adding/removing click event on the map
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      // Function to handle the map click event
      const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const latLng = event.latLng?.toJSON();
        if (latLng) {
          setClickedLocation({ lat: latLng.lat, lng: latLng.lng });
        }
      };

      // Add event listener for map click
      const clickListener = map.addListener("click", handleMapClick);

      // Cleanup function to remove the event listener when the component unmounts
      return () => {
        google.maps.event.removeListener(clickListener);
      };
    }
  }, [mapRef.current]); // Only run this effect when the map is ready

  const handleMapClick = (event: MapMouseEvent) => {
    const position = event.LangLat;
    const latLng = event.LatlangLiteral?.toJSON();
    if (latLng) {
      setClickedLocation({ lat: latLng.lat, lng: latLng.lng });
    }
  };

  return (
    <Box>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div style={{ height: "650px", width: "100%" }}>
          {error && <p>{error}</p>}
          <Map
            ref =
            defaultZoom={userLocation ? 12 : 5}
            defaultCenter={userLocation || { lat: 20.5937, lng: 78.9629 }} // Default to India if no location is found
            mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
            onClick={handleMapClick}
          >
            {/* Marker for user's geolocation */}
            {userLocation && (
              <Marker position={userLocation} title="Your Location" />
            )}

            {/* Marker for the clicked location */}
            {clickedLocation && (
              <Marker
                position={clickedLocation}
                title={`Clicked Location: (${clickedLocation.lat}, ${clickedLocation.lng})`}
              />
            )}
          </Map>
        </div>

        {/* "Use Your Location" button */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button
            variant="contained"
            onClick={handleUseLocation}
            disabled={loading}
          >
            {loading ? "Getting Location..." : "Use Your Location"}
          </Button>
        </Box>
      </APIProvider>
    </Box>
  );
};

export default LocationMap;
