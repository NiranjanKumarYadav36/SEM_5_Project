import React, { useRef, useState, useEffect } from 'react';

interface LatLng {
  lat: number;
  lng: number;
}

const GoogleMapWithClickMarker: React.FC = () => {
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the map when the component mounts
    if (mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // Default center (India)
        zoom: 5,
      });

      // Add a click event listener to the map
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const clickedLatLng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };

          // Set the marker position state
          setMarkerPosition(clickedLatLng);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Create a new marker whenever the markerPosition state changes
    if (markerPosition && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: markerPosition,
        zoom: 8, // Zoom in when the marker is set
      });

      new google.maps.Marker({
        position: markerPosition,
        map: map,
      });
    }
  }, [markerPosition]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '500px' }}
      ></div>
      {markerPosition && (
        <p>
          Marker placed at: Latitude: {markerPosition.lat}, Longitude: {markerPosition.lng}
        </p>
      )}
    </div>
  );
};

export default GoogleMapWithClickMarker;
