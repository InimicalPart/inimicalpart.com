import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Error from "./Error.js";
import Main from "./Main.js";
// import WIIDSite from "./WIIDSite.js";
import RealTime from "./realtimeApp.js";
// import Navigation from "./Navigation";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Navigation /> */}
        <Routes>
          <Route path="/" element={<Main />} exact />
          <Route path="/realtime" element={<RealTime />} />
          {/* <Route path="/wiid" element={<WIIDSite />} /> */}
          <Route element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
