import { useState, useEffect } from "react";
import { AuthService } from "../services/api/authService";

export function useBackendCheck(intervalMs = 10000) {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const authService = new AuthService();

    const checkBackend = async () => {
      const isReady = await authService.healthCheck();
      if (isReady) {
        setBackendReady(true);
        clearInterval(interval);
      }
    };

    const interval = setInterval(checkBackend, intervalMs);
    checkBackend();

    return () => clearInterval(interval);
  }, [intervalMs]);

  return backendReady;
}