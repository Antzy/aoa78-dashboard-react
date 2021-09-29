import React, { createContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { auth, firestore } from "../models/firebase";

export const UserContext = createContext();

export default function UserContextProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (!user.email) return;
        console.log(user.email);

        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
