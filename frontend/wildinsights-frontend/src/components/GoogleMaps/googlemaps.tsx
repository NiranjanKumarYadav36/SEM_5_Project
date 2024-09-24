/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import axiosclient from "../Apiclient/axiosclient";
import LoadingScreen from "../LoadingScreen/Loading";

const center = { lat: 20.5937, lng: 78.9629 };

interface ObservationData {
  image: URL;
  latitude: number;
  longitude: number;
  username: string;
}

const Maps: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [data, setData] = useState<ObservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<ObservationData | null>(null);

  // Fetch data inside useEffect to load on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosclient.get("/explore");
        console.log(response.data.data)
        setData(response.data.data || []); // Set to an empty array if data is null or undefined
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkerClick = (item: ObservationData) => {
    setSelectedMarker(item);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>; // Display error if loading fails
  }

  return (
    <Box sx={{ position:"relative", height: "600px", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoomLevel}
        onLoad={(map) => setMap(map)}
      >
        {data.length === 0 ? (
          <div>No data available.</div>
        ) : (
          data.map((item, index) => (
            <Marker
              key={index}
              position={{ lat: item.latitude, lng: item.longitude }}
              onClick={() => handleMarkerClick(item)}
            />
          ))
        )}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.latitude,
              lng: selectedMarker.longitude,
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ textAlign: "center" }}>
              <img src={selectedMarker.image.toString()} alt={selectedMarker.username} style={{ width: '100px', height: 'auto' }} />
              <p>{selectedMarker.username}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Box>
  );
};

export default Maps;
