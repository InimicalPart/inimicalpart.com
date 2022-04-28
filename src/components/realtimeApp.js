import React from "react";
import Years from "./realtime/years.js";
import NextBD from "./realtime/nextbd.js";
import "./realtime.module.css";

// class RealTime extends React.Component {
//   render() {
function RealTime(props) {
  console.log(props);
  return (
    <div>
      <Years />

      <NextBD color="lightgray" />
    </div>
  );
}
export default RealTime;
