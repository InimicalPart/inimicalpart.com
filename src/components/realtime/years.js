import React from "react";
let tipEnabled,
  cutOff,
  tip = null;

tip = "55533";
class Years extends React.Component {
  render() {
    console.log(this);
    setInterval(this.tick, 15);
    tipEnabled = this.props["data-tip"] ? true : false;
    cutOff = parseInt(this.props.cutOff) || 15;
    if (!this.props.simple) {
      return (
        <p
          id="iniAge"
          style={{
            color: this.props.textColor || "black",
            fontSize: this.props.fontSize || "1.5em",
          }}
        >
          I am{" "}
          <span
            id="isYears"
            data-tip={tip || ""}
            style={{
              color: this.props.boldTextColor || "black",
            }}
          ></span>{" "}
          years old
        </p>
      );
    } else {
      return (
        <span
          id="isYears"
          data-tip={tip || ""}
          style={{
            fontSize: this.props.fontSize || "1.5em",
            color: this.props.boldTextColor || "black",
          }}
        ></span>
      );
    }
  }
  tick() {
    var unixAge = 1163622720000; // my birthday :)
    let time;
    if (!document.hidden) {
      // only execute if the page is visible to save resources

      let isYears = document.getElementById("isYears"); // Get the 'isYears' element
      if (isYears) {
        time =
          (new Date() - new Date(unixAge)) /
          (1000 * 60 * 60 * 24 * 365.2666666666666);
        time = String(time).split(".");
        if (tipEnabled) {
          tip = time[0] + "." + String(time[1]).padEnd(15, "0");
        }
        time[1] = String(time[1]).padEnd(cutOff, "0");
        time[1] = time[1].substring(0, cutOff);
        time = time.join(".");
        isYears.innerHTML = "<b>" + time + "</b>";
        if (tipEnabled) {
          isYears.setAttribute("data-tip", tip);
        }
      }
    }
  }
}
export default Years;
