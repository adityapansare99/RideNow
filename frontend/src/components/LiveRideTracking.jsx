import React, { useState, useEffect, useContext, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { SocketContext } from "../context/SocketContext.jsx";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LiveRideTracking = ({ ride, userType }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [captainPosition, setCaptainPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [heading, setHeading] = useState(0);
  const [captainHeading, setCaptainHeading] = useState(0);
  const { socket } = useContext(SocketContext);
  const lastRouteUpdate = useRef(Date.now());
  const isCalculatingRoute = useRef(false);
  const previousPosition = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    preventGoogleFontsLoading: true,
  });

  const calculateHeading = (start, end) => {
    if (!start || !end) return 0;

    const startLat = (start.lat * Math.PI) / 180;
    const startLng = (start.lng * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;
    const endLng = (end.lng * Math.PI) / 180;

    const dLng = endLng - startLng;

    const y = Math.sin(dLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;

    return (bearing + 360) % 360;
  };

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.webkitCompassHeading) {
        setHeading(event.webkitCompassHeading);
      } else if (event.alpha) {
        setHeading(360 - event.alpha);
      }
    };

    const requestOrientationPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true,
            );
          }
        } catch (error) {
          console.log("Orientation permission denied");
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    };

    requestOrientationPermission();

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, heading: gpsHeading } = position.coords;
      const newPos = { lat: latitude, lng: longitude };

      setCurrentPosition(newPos);

      if (gpsHeading !== null && gpsHeading !== undefined) {
        setHeading(gpsHeading);
      }
    });

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading: gpsHeading } = position.coords;
        const newPos = { lat: latitude, lng: longitude };

        if (previousPosition.current) {
          const calculatedHeading = calculateHeading(
            previousPosition.current,
            newPos,
          );

          if (gpsHeading !== null && gpsHeading !== undefined) {
            setHeading(gpsHeading);
          } else {
            setHeading(calculatedHeading);
          }
        }

        previousPosition.current = newPos;
        setCurrentPosition(newPos);
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, maximumAge: 0 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const calculateDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return Infinity;

    const R = 6371e3;
    const φ1 = (pos1.lat * Math.PI) / 180;
    const φ2 = (pos2.lat * Math.PI) / 180;
    const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const isOffRoute = (currentPos, routePoints) => {
    if (!currentPos || !routePoints || routePoints.length === 0) return false;

    let minDistance = Infinity;

    routePoints.forEach((point) => {
      const distance = calculateDistance(currentPos, {
        lat: point.lat(),
        lng: point.lng(),
      });
      if (distance < minDistance) {
        minDistance = distance;
      }
    });

    return minDistance > 50;
  };

  useEffect(() => {
    if (!isLoaded || !ride?.destination || isCalculatingRoute.current) return;

    const directionsService = new window.google.maps.DirectionsService();

    let origin;
    let shouldRecalculate = false;

    if (userType === "captain" && currentPosition) {
      origin = currentPosition;

      if (!directions) {
        shouldRecalculate = true;
      } else if (directions?.routes?.[0]?.overview_path) {
        const routePoints = directions.routes[0].overview_path;
        if (isOffRoute(currentPosition, routePoints)) {
          console.log("Captain is off-route! Recalculating...");
          shouldRecalculate = true;
        }
      }

      const timeSinceLastUpdate = Date.now() - lastRouteUpdate.current;
      if (timeSinceLastUpdate > 30000 && directions) {
        console.log("30 seconds passed, updating route with traffic...");
        shouldRecalculate = true;
      }
    } else if (userType === "user" && ride?.pickup) {
      origin = ride.pickup;

      if (!directions) {
        shouldRecalculate = true;
      }
    } else {
      return;
    }

    if (shouldRecalculate) {
      isCalculatingRoute.current = true;

      directionsService.route(
        {
          origin: origin,
          destination: ride.destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: "bestguess",
          },
          provideRouteAlternatives: false,
        },
        (result, status) => {
          isCalculatingRoute.current = false;

          if (status === "OK") {
            setDirections(result);
            lastRouteUpdate.current = Date.now();
            console.log(`Route updated! (${userType})`);
          } else {
            console.error("Directions request failed:", status);
          }
        },
      );
    }
  }, [ride?.pickup, ride?.destination, isLoaded, currentPosition, userType]);

  useEffect(() => {
    if (
      userType !== "captain" ||
      !ride?._id ||
      !ride?.captain ||
      !currentPosition
    )
      return;

    const captainId =
      typeof ride.captain === "string" ? ride.captain : ride.captain._id;

    const locationInterval = setInterval(() => {
      socket.emit("update-captain-location-ride", {
        userId: captainId,
        location: {
          ltd: currentPosition.lat,
          lng: currentPosition.lng,
        },
        heading: heading,
        rideId: ride._id,
      });
    }, 3000);

    return () => clearInterval(locationInterval);
  }, [currentPosition, heading, userType, ride, socket]);

  useEffect(() => {
    if (userType !== "user") return;

    const handleCaptainUpdate = (data) => {
      console.log("User received captain location:", data);
      setCaptainPosition({
        lat: data.location.ltd,
        lng: data.location.lng,
      });

      if (data.heading !== undefined) {
        setCaptainHeading(data.heading);
      }
    };

    socket.on("captain-location-update", handleCaptainUpdate);

    return () => socket.off("captain-location-update", handleCaptainUpdate);
  }, [socket, userType]);

  const mapCenter =
    userType === "captain"
      ? currentPosition
      : captainPosition || currentPosition;

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <p className="text-red-600">
          Error loading maps. Please refresh the page.
        </p>
      </div>
    );
  }

  if (!isLoaded || !currentPosition) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  const rotation = userType === "captain" ? heading : captainHeading;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={15}
      options={{
        gestureHandling: "greedy",
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
      }}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#10b981",
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
          }}
        />
      )}

      {currentPosition && (
        <Marker
          position={
            userType === "captain"
              ? currentPosition
              : captainPosition || currentPosition
          }
          icon={{
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            rotation: rotation,
          }}
          title={userType === "captain" ? "You" : "Your Captain"}
          zIndex={1000}
        />
      )}
    </GoogleMap>
  );
};

export default LiveRideTracking;
