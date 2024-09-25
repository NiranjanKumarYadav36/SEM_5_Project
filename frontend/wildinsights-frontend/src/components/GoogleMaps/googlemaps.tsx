/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import axiosclient from "../Apiclient/axiosclient";
import LoadingScreen from "../LoadingScreen/Loading";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer"; // Ensure correct Marker import

interface ObservationData {
  image: URL;
  latitude: number;
  longitude: number;
  username: string;
}

const Maps: React.FC = () => {
  const [data, setData] = useState<ObservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data inside useEffect to load on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosclient.get("/explore");
        console.log(response.data.data);
        setData(response.data.data || []); // Set to an empty array if data is null or undefined
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>; // Display error if loading fails
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Box sx={{ height: "600px", width: "100%" }}>
        <Map
          zoom={5}
          center={{ lat: 20.5937, lng: 78.9629 }}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
          gestureHandling="cooperative"
          zoomControl={true}
        >
          <Markers
            points={data.map((item, index) => ({
              lat: item.latitude,
              lng: item.longitude,
              key: `${item.username}-${index}`, // Generate unique keys
              ...item,
            }))}
          />
        </Map>
      </Box>
    </APIProvider>
  );
};

export default Maps;

// Updated types for points
type Point = {
  lat: number;
  lng: number;
  key: string;
  image: URL;
  username: string;
};

type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          position={{ lat: point.lat, lng: point.lng }} // Correct position format
          key={point.key}
          ref={(marker) => setMarkerRef(marker as unknown as Marker, point.key)} // Type casting to Marker
        />
      ))}
    </>
  );
};
