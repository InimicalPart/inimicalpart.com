import React from "react";

import { NavLink } from "react-router-dom";

class Navigation extends React.Component {
  render() {
    return (
      <div>
        <NavLink to="/">Home</NavLink>
        {/* <NavLink to="/realtime">Realtime</NavLink> */}
      </div>
    );
  }
}

export default Navigation;
