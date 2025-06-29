import { useState, useEffect } from "react";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem("admin_authenticated");
      const loginTime = localStorage.getItem("admin_login_time");
      
      if (authenticated === "true" && loginTime) {
        const currentTime = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        
        if (currentTime - loginTimestamp < sessionDuration) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem("admin_authenticated");
          localStorage.removeItem("admin_login_time");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_login_time");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
}