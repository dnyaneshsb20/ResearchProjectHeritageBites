import React from "react";
import Routes from "./Routes";
import { Toaster } from "react-hot-toast";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop"; // ✅ import here

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ScrollToTop /> {/* ✅ Ensures every new page loads from top */}
      <Routes />
      <ScrollToTopButton /> {/* ✅ Floating scroll-to-top button */}
    </>
  );
}

export default App;
