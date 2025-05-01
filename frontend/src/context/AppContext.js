"use client";

import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const { data } = await api.get(`/api/auth/data`);
      if (data.success) {
        const user = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          isVerified: data.user.isAccountVerified,
          savedItineraries: data.user.savedItineraries,
          createdAt: data.user.createdAt,
        };
        setUserData(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Data error:", error);
      toast.error("Fetching data failed. Please log in again.");
    }
  };

  const getAuthState = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await api.get(`/api/auth/isAuth`);

        if (response.data.success) {
          setIsLoggedin(true);
          await getUserData();
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Auth error:", error);
        handleLogout();
      }
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedin(false);
    setUserData(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setIsLoggedin(true);
    } else {
      getAuthState();
    }
  }, []);

  const value = {
    userData,
    setUserData,
    isLoggedin,
    setIsLoggedin,
    loading,
    handleLogout,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
