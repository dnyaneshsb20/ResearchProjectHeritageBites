import React from "react";
import Routes from "./Routes";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop"; // ✅ add this import

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes />
      <ScrollToTop /> {/* ✅ Add this line */}
    </>
  );
}

export default App;
