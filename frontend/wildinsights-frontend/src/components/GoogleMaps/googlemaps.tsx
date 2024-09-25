/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import LoadingScreen from "../LoadingScreen/Loading";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer"; // Ensure correct Marker import
import { useObservationData } from "../Explore/DataFetcher/observationdata";

const Maps: React.FC = () => {
  const { data, loading, error } = useObservationData();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>; // Display error if loading fails
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "600px", width: "100%" }}>
        <Map
          defaultZoom={5}
          defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
          gestureHandling= {"greedy"} // Override passive behavior to allow zoom
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
      </div>
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
  category: string;
  common_name: string;
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