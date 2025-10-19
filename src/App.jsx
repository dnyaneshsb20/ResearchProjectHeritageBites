import React from "react";
import Routes from "./Routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes />
    </>
  );
}

export default App;
