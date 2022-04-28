import React from "react";
import WIID from "./WIID";
class WIIDSite extends React.Component {
  render() {
    return (
      <div>
        <WIID updateInterval="1000" />
      </div>
    );
  }
}
export default WIIDSite;
