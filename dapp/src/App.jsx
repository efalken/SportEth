import React from "react";
import "./App.css";
import { AuthContextProvider } from "./contexts/AuthContext";
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
