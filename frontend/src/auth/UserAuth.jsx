import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "../config/axios";

function UserAuth({ children }) {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("Auth-Token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (user) {
      setLoading(false);
      return;
    }

    axios
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("Auth-Token"); // clear invalid token
      })
      .finally(() => setLoading(false));
  }, [token, user, setUser]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  // Only redirect if token is missing OR user failed to load
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default UserAuth;
