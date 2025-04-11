"use client";

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = "http://localhost:5000";
  console.log("Backend URL:", backendURL);

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = backendURL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        setIsLoggedin(false);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`/api/auth/isAuth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setIsLoggedin(false);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`/api/auth/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.userData);
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
    backendURL,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
