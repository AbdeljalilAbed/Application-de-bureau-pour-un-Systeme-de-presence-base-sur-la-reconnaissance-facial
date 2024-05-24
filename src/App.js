import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Prof from "./pages/Prof";
import Admin from "./pages/Admin";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Prof />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/NotFoundPage" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
