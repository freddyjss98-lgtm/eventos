import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";

type Coords = { latitude: number; longitude: number } | null;

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coords>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        setLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err: any) {
      setError(err?.message || "Error obteniendo la ubicación");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Intentar obtener la ubicación al montar
    requestLocation();
  }, [requestLocation]);

  return {
    coords,
    loading,
    error,
    requestLocation, // exponer para reintentar si el usuario cambia permisos
  };
}