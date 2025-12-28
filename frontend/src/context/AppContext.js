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
          gender: data.user.gender || "",
          userLocation: data.user.userLocation || "",
          profileImage: data.user.profileImage || "/profiles/avatar1.png",
          bannerImage: data.user.bannerImage || "/banners/banner1.jpg",
          isAccountVerified: data.user.isAccountVerified,
          savedItineraries: data.user.savedItineraries,
          createdAt: data.user.createdAt,
        };
        setUserData(user);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      } else {
        toast.error(data.message || "Failed to fetch user data");
        return false;
      }
    } catch (error) {
      console.error("Data error:", error);
      // Don't show toast here as api interceptor handles it
      return false;
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
          const success = await getUserData();
          if (!success) {
            handleLogout();
          }
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
    const token = localStorage.getItem("token");
    
    if (savedUser && token) {
      try {
        setUserData(JSON.parse(savedUser));
        setIsLoggedin(true);
        // Verify token is still valid
        getAuthState();
      } catch (error) {
        console.error("Error parsing saved user:", error);
        handleLogout();
        setLoading(false);
      }
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
    getUserData,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
