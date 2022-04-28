import confetti from "canvas-confetti";
import $ from "jquery";
import React from "react";
var mode = "seconds";
var modeWas = "seconds";
var celebrationTime = false;

class NextBD extends React.Component {
  render() {
    setInterval(this.tick, 15);
    setInterval(this.tick2, 50);
    setTimeout(() => {
      $("#willBeMode").click(function (e) {
        if (typeof e !== "object" && !e.originalEvent?.isTrusted) {
          console.log("haha nah.");
          return;
        }
        if (mode === "milliseconds") {
          mode = "seconds";
          $("#willBeMode").html(" seconds");
        } else if (mode === "seconds") {
          mode = "minutes";
          $("#willBeMode").text(" minutes");
        } else if (mode === "minutes") {
          mode = "hours";
          $("#willBeMode").text(" hours");
        } else if (mode === "hours") {
          mode = "days";
          $("#willBeMode").text(" days");
        } else if (mode === "days") {
          mode = "weeks";
          $("#willBeMode").text(" weeks");
        } else if (mode === "weeks") {
          mode = "months";
          $("#willBeMode").text(" months");
        } else if (mode === "months") {
          mode = "milliseconds";
          $("#willBeMode").text(" milliseconds");
        } else {
          mode = "seconds";
          $("#willBeMode").text(" seconds");
        }
      });
    }, 100);
    return (
      <p
        id="iniUntil"
        style={{
          color: this.props.textColor || "black",
          fontSize: this.props.fontSize || "1.5em",
        }}
      >
        I will be{" "}
        <span
          id="willBeAge"
          style={{
            color: this.props.boldTextColor || "black",
          }}
        ></span>{" "}
        in{" "}
        <span
          id="willBeAgeInSec"
          style={{
            color: this.props.boldTextColor || "black",
          }}
        ></span>
        <span
          style={{
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            MsUserSelect: "none",
            UserSelect: "none",
            cursor: "default",
            color: this.props.clickColor || "white",
          }}
          id="willBeMode"
        >
          {" "}
          seconds
        </span>
      </p>
    );
  }
  tick2() {
    if (!document.hidden) {
      // only execute if the page is visible to save resources
      var modeIs = mode;
      if (modeIs !== modeWas) {
        try {
          if (mode === "milliseconds") {
            $("#willBeMode").html(" milliseconds");
          } else if (mode === "seconds") {
            $("#willBeMode").text(" seconds");
          } else if (mode === "minutes") {
            $("#willBeMode").text(" minutes");
          } else if (mode === "hours") {
            $("#willBeMode").text(" hours");
          } else if (mode === "days") {
            $("#willBeMode").text(" days");
          } else if (mode === "weeks") {
            $("#willBeMode").text(" weeks");
          } else if (mode === "months") {
            $("#willBeMode").text(" months");
          }
        } catch (e) {
          //do nothing, the user broke it.
        }
      }
      modeWas = modeIs;
    }
  }
  tick() {
    let willBeAge = document.getElementById("willBeAge");
    let willBeAgeInSec = document.getElementById("willBeAgeInSec");
    if (willBeAge && willBeAgeInSec) {
      let time, temp, timeLeftS, isItTime;
      let unixAge = 1163622720000; // my birthday :)
      time =
        (new Date() - new Date(unixAge)) /
        (1000 * 60 * 60 * 24 * 365.2666666666666);
      // console.log(time)
      time = String(time).split(".");
      time[1] = String(time[1]).padEnd(15, "0");
      time = time.join(".");
      const yearsNow = parseInt(time.toString().replace(/\..*/g, ""));
      if (mode === "milliseconds") {
        timeLeftS = nextBirthday(new Date(unixAge)) - new Date().getTime();
      } else if (mode === "seconds") {
        timeLeftS = "" + (nextBirthday(new Date(unixAge)) - new Date()) / 1000;
        temp = timeLeftS.split(".");
        if (temp[1] === undefined || temp[1] === "undefined") {
          temp[1] = "0";
        }
        temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0");
        timeLeftS = temp.join(".");
        // console.log(timeLeftS)
      } else if (mode === "minutes") {
        timeLeftS =
          "" + (nextBirthday(new Date(unixAge)) - new Date()) / (1000 * 60);
        temp = timeLeftS.split(".");
        if (temp[1] === undefined || temp[1] === "undefined") {
          temp[1] = "0";
        }
        temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0");
        timeLeftS = temp.join(".");
      } else if (mode === "hours") {
        timeLeftS =
          "" +
          (nextBirthday(new Date(unixAge)) - new Date()) / (1000 * 60 * 60);
        temp = timeLeftS.split(".");
        if (temp[1] === undefined || temp[1] === "undefined") {
          temp[1] = "0";
        }
        temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0");
        timeLeftS = temp.join(".");
      } else if (mode === "days") {
        timeLeftS =
          "" +
          (nextBirthday(new Date(unixAge)) - new Date()) /
            (1000 * 60 * 60 * 24);
        temp = timeLeftS.split(".");
        if (temp[1] === undefined || temp[1] === "undefined") {
          temp[1] = "0";
        }
        temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0");
        timeLeftS = temp.join(".");
      } else if (mode === "weeks") {
        timeLeftS =
          "" +
          (nextBirthday(new Date(unixAge)) - new Date()) /
            (1000 * 60 * 60 * 24 * 7);
        temp = timeLeftS.split(".");
        if (temp[1] === undefined || temp[1] === "undefined") {
          temp[1] = "0";
        }
        temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0");
        timeLeftS = temp.join(".");
      } else if (mode === "months") {
        timeLeftS =
          "" +
          (nextBirthday(new Date(unixAge)) - new Date()) /
            (1000 * 60 * 60 * 24 * 30.417);
        temp = timeLeftS.split(".");
        if (temp[1] === undefined || temp[1] === "undefined") {
          temp[1] = "0";
        }
        temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0");
        timeLeftS = temp.join(".");
      } else {
        timeLeftS = "error";
      }
      isItTime = null;
      isItTime = "" + (nextBirthday(new Date(unixAge)) - new Date()) / 1000;
      temp = isItTime.split(".");
      if (temp[1] === "undefined" || temp[1] === undefined) {
        temp[1] = "0";
      }
      temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0");
      isItTime = temp.join(".");
      if (parseFloat(isItTime) < 0.05 && celebrationTime === false) {
        HBD_Confetti();
        celebrationTime = true;
      }
      if (parseFloat(isItTime) > 0.05 && celebrationTime === true) {
        //reset celebration
        celebrationTime = false;
      }
      if (timeLeftS !== "error") {
        willBeAge.innerHTML = "<b>" + (yearsNow + 1) + "</b>";
        willBeAgeInSec.innerHTML = "<b>" + timeLeftS + "</b>";
      } else {
        // if my mode variable was tampered, display message
        document.getElementById("iniUntil").innerHTML =
          "<b>😢 y u break it man, i spend multiple hours on dis.</b>";
      }

      /**
       *
       * @description Check when the next birthday is
       *
       * @returns An epoch time number of my next birthday
       *
       * @param {bool} verbose @optional
       */
      function nextBirthday(date, verbose) {
        let thisYearBd = new Date(
          date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            new Date().getFullYear() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds()
        );
        // console.log(thisYearBd)
        if (thisYearBd < new Date()) {
          thisYearBd = thisYearBd.setFullYear(thisYearBd.getFullYear() + 1);
        }
        if (verbose) {
          console.log(new Date(thisYearBd));
        }
        if (thisYearBd instanceof Date) {
          return thisYearBd.getTime();
        } else {
          return thisYearBd;
        }
      }
      /**
       *
       * @description Starts the confetti
       *
       *
       *
       */

      function HBD_Confetti() {
        var duration = 10 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function () {
          var timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          var particleCount = 125 * (timeLeft / duration);
          // since particles fall down, start a bit higher than random
          confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.1, 0.5), y: Math.random() - 0.2 },
            })
          );
          confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.5, 0.9), y: Math.random() - 0.2 },
            })
          );
        }, 250);
      }
    }
  }
}
export default NextBD;
