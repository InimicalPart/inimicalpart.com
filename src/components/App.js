import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Error from "./Error";
import Main from "./Main";
import WIIDSite from "./WIIDSite";
// import Navigation from "./Navigation";
import RealTime from "./realtimeApp";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Navigation /> */}
        <Routes>
          <Route path="/" element={<Main />} exact />
          <Route path="/realtime" element={<RealTime />} />
          <Route path="/wiid" element={<WIIDSite />} />
          <Route element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
