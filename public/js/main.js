/***********************************************
 *  Copyright (c) 2021 InimicalPart
 *  All rights reserved.
 * 
 *  This program is under the MIT license.
 **********************************************/



var dayConvert = 365.2666666666666; // the amount of days in a year (adjusted for my purpose)
var mode = "seconds";
function openTwtr() {
  window.open("https://www.twitter.com/InimicalPart");
}
function openGH() {
  window.open("https://github.com/InimicalPart");
}
function openDC() {
  for (let i of document.getElementById("clickdc").parentNode.childNodes) {
    if (i.tagName === "SPAN") {
      i.classList.toggle("show");
    }
  }
  copyTextToClipboard("InimicalPart ©#4542");
}
function openMail() {
  window.location.href = "mailto:inimicalpart@gmail.com"; //TODO: change this to me@inimicalpart.com after inimicalpart.com is registered
}
function togglePopup(popup) {
  popup.classList.toggle("show");
}
// prettier-ignore
function copyTextToClipboard(text) {if (!navigator.clipboard) {fallbackCopyTextToClipboard(text);return;function fallbackCopyTextToClipboard(text){var textArea=document.createElement("textarea");textArea.value=text;textArea.style.top="0";textArea.style.left="0";textArea.style.position="fixed";document.body.appendChild(textArea);textArea.focus();textArea.select();try{document.execCommand("copy")}catch(err){}document.body.removeChild(textArea)}}navigator.clipboard.writeText(text);}
function isRealEvent(e) {
  // check if event is trusted
  if (typeof e === "object" && e.originalEvent?.isTrusted) {
    return true;
  }
  return false;
}
var modeWas = null;
function setup() {
  $("#pfpimg").on("dragstart", function (event) {
    event.preventDefault();
  });
  setInterval(() => {
    if (!document.hidden) {
      // only execute if the page is visible to save resources
      var modeIs = mode;
      if (modeIs !== modeWas) {
        try {
          if (mode === "milliseconds") {
            $("#willBeMode").html("milliseconds");
          } else if (mode === "seconds") {
            $("#willBeMode").text("seconds");
          } else if (mode === "minutes") {
            $("#willBeMode").text("minutes");
          } else if (mode === "hours") {
            $("#willBeMode").text("hours");
          } else if (mode === "days") {
            $("#willBeMode").text("days");
          } else if (mode === "weeks") {
            $("#willBeMode").text("weeks");
          } else if (mode === "months") {
            $("#willBeMode").text("months");
          }
        } catch (e) {
          //do nothing, the user broke it.
        }
      }
      modeWas = modeIs;
    }
  }, 50);
  $("#willBeMode").click(function (e) {
    if (!isRealEvent(e)) {
      console.log("haha nah.");
      return;
    }
    if (mode === "milliseconds") {
      mode = "seconds";
      $("#willBeMode").html("seconds");
    } else if (mode === "seconds") {
      mode = "minutes";
      $("#willBeMode").text("minutes");
    } else if (mode === "minutes") {
      mode = "hours";
      $("#willBeMode").text("hours");
    } else if (mode === "hours") {
      mode = "days";
      $("#willBeMode").text("days");
    } else if (mode === "days") {
      mode = "weeks";
      $("#willBeMode").text("weeks");
    } else if (mode === "weeks") {
      mode = "months";
      $("#willBeMode").text("months");
    } else if (mode === "months") {
      mode = "milliseconds";
      $("#willBeMode").text("milliseconds");
    } else {
      mode = "seconds";
      $("#willBeMode").text("seconds");
    }
  });
}
setInterval(() => {
  if (!document.hidden) {
    // only execute if the page is visible to save resources
    if (!$("#profileCircle").is(":hover")) {
      $("#profileCircleName").css("opacity", "0");
    }
  }
}, 50);
setup();

var unixAge = 1163622720000;
let time;
let timeLeftS;
let timer = setInterval(() => {
  if (!document.hidden) {
    // only execute if the page is visible to save resources

    let isYears = document.getElementById("isYears");
    let willBeAge = document.getElementById("willBeAge");
    let willBeAgeInSec = document.getElementById("willBeAgeInSec");
    time =
      (new Date() - new Date(unixAge)) /
      (1000 * 60 * 60 * 24 * 365.2666666666666);
    // console.log(time)
    time = String(time).split(".");
    time[1] = String(time[1]).padEnd(15, "0");
    time = time.join(".");
    isYears.innerHTML = "<b>" + time + "</b>";
    const yearsNow = parseInt(time.toString().replace(/\..*/g, ""));
    if (mode === "milliseconds") {
      timeLeftS = nextBirthday(new Date(unixAge)) - new Date().getTime();
    } else if (mode === "seconds") {
      timeLeftS = "" + (nextBirthday(new Date(unixAge)) - new Date()) / 1000;
      temp = timeLeftS.split(".");
      temp[1] = String(temp[1]).substring(0, 3).padEnd(3, "0");
      if (temp[1] === undefined) {
        temp[1] = "0";
      }
      timeLeftS = temp.join(".");
      // console.log(timeLeftS)
    } else if (mode === "minutes") {
      timeLeftS =
        "" + (nextBirthday(new Date(unixAge)) - new Date()) / (1000 * 60);
      temp = timeLeftS.split(".");
      temp[1] = String(temp[1]).substring(0, 4).padEnd(4, "0");
      if (temp[1] === undefined) {
        temp[1] = "0";
      }
      timeLeftS = temp.join(".");
    } else if (mode === "hours") {
      timeLeftS =
        "" + (nextBirthday(new Date(unixAge)) - new Date()) / (1000 * 60 * 60);
      temp = timeLeftS.split(".");
      temp[1] = String(temp[1]).substring(0, 5).padEnd(5, "0");
      if (temp[1] === undefined) {
        temp[1] = "0";
      }
      timeLeftS = temp.join(".");
    } else if (mode === "days") {
      timeLeftS =
        "" +
        (nextBirthday(new Date(unixAge)) - new Date()) / (1000 * 60 * 60 * 24);
      temp = timeLeftS.split(".");
      temp[1] = String(temp[1]).substring(0, 6).padEnd(6, "0");
      if (temp[1] === undefined) {
        temp[1] = "0";
      }
      timeLeftS = temp.join(".");
    } else if (mode === "weeks") {
      timeLeftS =
        "" +
        (nextBirthday(new Date(unixAge)) - new Date()) /
          (1000 * 60 * 60 * 24 * 7);
      temp = timeLeftS.split(".");
      temp[1] = String(temp[1]).substring(0, 7).padEnd(7, "0");
      if (temp[1] === undefined) {
        temp[1] = "0";
      }
      timeLeftS = temp.join(".");
    } else if (mode === "months") {
      timeLeftS =
        "" +
        (nextBirthday(new Date(unixAge)) - new Date()) /
          (1000 * 60 * 60 * 24 * 30.417);
      temp = timeLeftS.split(".");
      temp[1] = String(temp[1]).substring(0, 8).padEnd(8, "0");
      if (temp[1] === undefined) {
        temp[1] = "0";
      }
      timeLeftS = temp.join(".");
    } else {
      timeLeftS = "error";
    }
    if (timeLeftS !== "error") {
      willBeAge.innerHTML = "<b>" + (yearsNow + 1) + "</b>";
      willBeAgeInSec.innerHTML = "<b>" + timeLeftS + "</b>";
      // document.getElementById("nextBDD").innerHTML = "<b>" + new Date(nextBirthday(new Date(unixAge))) + "</b>";
    } else {
      document.getElementById("iniUntil").innerHTML =
        "<b>😢 y u break it man, i spend multiple hours on dis.</b>";
    }
  }
}, 50);

/**
 *
 * @param {bool} a @optional
 */
function nextBirthday(date, a) {
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
  if (a) {
    console.log(new Date(thisYearBd));
  }
  if (thisYearBd instanceof Date) {
    return thisYearBd.getTime();
  } else {
    return thisYearBd;
  }
}
