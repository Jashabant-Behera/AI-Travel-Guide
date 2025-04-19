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
      const response = await api.get(`/api/auth/data`);
      if (response.data.success) {
        const user = {
          id: response.data.userData._id,
          name: response.data.userData.name,
          email: response.data.userData.email,
          isVerified: response.data.userData.isAccountVerified,
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

      console.log("Token before API call:", token);

      try {
        const response = await api.get(`/api/auth/isAuth`);
        console.log("Token from localStorage:", token);

        if (response.data.success) {
          setIsLoggedin(true);
          await getUserData();
        } else {
          handleLogout();
        }

        console.log("Auth Response:", response.data);
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
    api,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
