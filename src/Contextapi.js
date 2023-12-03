import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false); // New state for open and setOpen

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
        console.log(error.message);
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
        console.log(error?.response?.data);
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
    }
  }, []);

  const contextValue = {
    data,
    open,
    setOpen,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
