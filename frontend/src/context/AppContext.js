"use client";

import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // const getAuthState = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const storedUser = localStorage.getItem("user");

  //     console.log("Token from localStorage:", token);
  //     console.log("Making auth check request to:", `/api/auth/isAuth`);

  //     if (!token) {
  //       setIsLoggedin(false);
  //       setLoading(false);
  //       return;
  //     }

  //     const response = await api.get(`/api/auth/isAuth`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     console.log("Auth Response:", response.data);

  //     if (response.data.success) {
  //       setIsLoggedin(true);
  //       await getUserData();
  //     } else {
  //       localStorage.removeItem("token");
  //       setIsLoggedin(false);
  //     }
  //   } catch (error) {
  //     console.error("Auth error:", error);
  //     setIsLoggedin(false);
  //     localStorage.removeItem("token");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getAuthState = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        // Verify token is still valid
        const verifyRes = await api.get("/api/auth/isAuth");
        if (verifyRes.data.success) {
          setIsLoggedin(true);
          setUserData(JSON.parse(storedUser));
          // Optionally refresh user data
          await getUserData();
        }
      } catch (error) {
        // Token invalid, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedin(false);
      }
    }
    setLoading(false);
  };

  const getUserData = async () => {
    try {
      const response = await api.get(`/api/auth/data`);
      if (response.data.success) {
        const userData = {
          id: response.data.userData._id,
          name: response.data.userData.name,
          email: response.data.userData.email,
          isVerified: response.data.userData.isAccountVerified,
        };
        setUserData(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Data error:", error);
      toast.error("Fetching Data is failed. Please log in again.");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    backendURL,
    api,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
