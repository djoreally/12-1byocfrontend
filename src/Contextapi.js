import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvderData = async () => {
      try {
        const Token = Cookies.get("token");
        if (Token) {
          const decoded = jwtDecode(Token);
          const response = await api.get(`/store/GetStore/${decoded.userId}`);
          const data = response.data.data;
          setData(data);
        }
      } catch (error) {
        // Silently handle – data stays null
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const Token = Cookies.get("token");
        if (Token) {
          const response = await api.get("/Auth/GetUserData");
          const data = response.data.result;
          setData(data);
        }
      } catch (error) {
        // Silently handle – data stays null
      } finally {
        setLoading(false);
      }
    };
    const Token = Cookies.get("token");

    if (Token) {
      const decoded = jwtDecode(Token);
      if (decoded?.role === "provider") {
        fetchProvderData();
      } else   {
        fetchUserData();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const contextValue = {
    data,
    open,
    setOpen,
    loading,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
