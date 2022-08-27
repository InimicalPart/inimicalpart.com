import React from "react";
import { Helmet } from "react-helmet";
// import Type from "./type.js";
import Years from "./realtime/years.js";
import ReactTooltip from "react-tooltip";
import $ from "jquery";
// let checkNeeded = false;
class Main extends React.Component {
  render() {
    return (
      <div>
        <ReactTooltip effect="solid" />
        <Helmet>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
            crossorigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"
          ></link>
          <link rel="stylesheet" href="/Main.css" type="text/css" />
        </Helmet>
        <div id="introduction" style={{ marginTop: "10px" }}>
          <div style={{ color: "white" }}>
            <b>Hello! I'm Inimi!</b>
          </div>

          <div id="age" style={{ fontSize: "15px", color: "white" }}>
            I am a{" "}
            <Years
              simple
              id="age"
              fontSize="20px"
              data-tip
              ref={(ref) => (this.ageRef = ref)}
              cutOff="8"
              textColor="white"
            />{" "}
            year old developer.
          </div>
          <div
            id="aboutme"
            style={{
              fontSize: "15px",
              margin: "20px 20px 0px 20px",
              color: "white",
            }}
          >
            I am a self-taught programmer, started learning how to code when I
            was 10 years old. I work on front-end and back-end development.
          </div>
        </div>
        <div className="SkillBoxContainer" id="skills">
          <div
            id="htmlBox"
            onClick={this.handleClick}
            className="htmlBox start skillBox"
          ></div>
          <div
            id="cssBox"
            onClick={this.handleClick}
            className="cssBox middle skillBox"
          ></div>
          <div
            id="jsBox"
            onClick={this.handleClick}
            className="jsBox middle skillBox"
          ></div>
          <div
            id="nodejsBox"
            onClick={this.handleClick}
            className="nodejsBox middle skillBox"
          ></div>
          <div
            id="reactBox"
            onClick={this.handleClick}
            className="reactBox end skillBox"
          ></div>
        </div>
        <div className="skillsTextContainer" id="skillTextContainer">
          <div id="HTMLSkillBox" className="skillTextBox HSB">
            <i
              style={{
                color: "white",
                position: "absolute",
                right: "20px",
                top: "20px",
                fontSize: "20px",
              }}
              className="closeX bi bi-x-lg"
              onClick={this.handleClick}
            ></i>
                        <div id="information" style={{ marginTop: "10px" }}>
                <p color="white" style={{
                    position:"absolute",
                    fontSize:"45px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>To Be Written</p>
            </div>
          </div>
          <div id="CSSSkillBox" className="skillTextBox CSB">
            <i
              style={{
                color: "white",
                position: "absolute",
                right: "20px",
                top: "20px",
                fontSize: "20px",
              }}
              className="closeX bi bi-x-lg"
              onClick={this.handleClick}
            ></i>
                        <div id="information" style={{ marginTop: "10px" }}>
                <p color="white" style={{
                    position:"absolute",
                    fontSize:"45px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>To Be Written</p>
            </div>
          </div>
          <div id="JSSkillBox" className="skillTextBox JSB">
            <i
              style={{
                color: "white",
                position: "absolute",
                right: "20px",
                top: "20px",
                fontSize: "20px",
              }}
              className="closeX bi bi-x-lg"
              onClick={this.handleClick}
            ></i>
                        <div id="information" style={{ marginTop: "10px" }}>
                <p color="white" style={{
                    position:"absolute",
                    fontSize:"45px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>To Be Written</p>
            </div>
          </div>
          <div id="NodeJSSkillBox" className="skillTextBox NJSB">
            <i
              style={{
                color: "white",
                position: "absolute",
                right: "20px",
                top: "20px",
                fontSize: "20px",
              }}
              className="closeX bi bi-x-lg"
              onClick={this.handleClick}
            ></i>
            <div id="information" style={{ marginTop: "10px" }}>
                <p color="white" style={{
                    position:"absolute",
                    fontSize:"45px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>To Be Written</p>
            </div>
          </div>
          <div id="ReactSkillBox" className="skillTextBox RSB">
            <i
              style={{
                color: "white",
                position: "absolute",
                right: "20px",
                top: "20px",
                fontSize: "20px",
              }}
              className="closeX bi bi-x-lg"
              onClick={this.handleClick}
            ></i>
                        <div id="information" style={{ marginTop: "10px" }}>
                <p color="white" style={{
                    position:"absolute",
                    fontSize:"45px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>To Be Written</p>
            </div>
          </div>
        </div>

        {/* <div id="themastercontainer">
          <div id="numberContainer1">
            <number id="number1">1</number>
            <number id="number2">2</number>
            <number id="number3">3</number>
            <number id="number4">4</number>
            <number id="number5">5</number>
            <number id="number6">6</number>
            <number id="number7">7</number>
            <number id="number8">8</number>
            <number id="number9">9</number>
            <number id="number0">0</number>
          </div>
          <div id="numberContainer2">
            <number id="number1">1</number>
            <number id="number2">2</number>
            <number id="number3">3</number>
            <number id="number4">4</number>
            <number id="number5">5</number>
            <number id="number6">6</number>
            <number id="number7">7</number>
            <number id="number8">8</number>
            <number id="number9">9</number>
            <number id="number0">0</number>
          </div>
          <div id="numberContainer3">
            <number id="number1">1</number>
            <number id="number2">2</number>
            <number id="number3">3</number>
            <number id="number4">4</number>
            <number id="number5">5</number>
            <number id="number6">6</number>
            <number id="number7">7</number>
            <number id="number8">8</number>
            <number id="number9">9</number>
            <number id="number0">0</number>
          </div>
          <div id="numberContainer4">
            <number id="number1">1</number>
            <number id="number2">2</number>
            <number id="number3">3</number>
            <number id="number4">4</number>
            <number id="number5">5</number>
            <number id="number6">6</number>
            <number id="number7">7</number>
            <number id="number8">8</number>
            <number id="number9">9</number>
            <number id="number0">0</number>
          </div>
        </div>
        <button
          id="test"
          onClick={this.handleClick2}
          className="btn btn-primary"
        >
          click Me
        </button> */}
        <div id="experience" style={{ marginTop: "10px" }}></div>
        <div id="education" style={{ marginTop: "10px" }}></div>
        <div id="contact" style={{ marginTop: "10px" }}></div>
        {/*
                        <a href="https://nodejs.org" style={{ color: "#01ac00" }}>
              Node.JS
            </a>
            ,{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML"
              style={{ color: "#ff8c00" }}
            >
              HTML
            </a>
            ,{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS"
              style={{ color: "#5995ff" }}
            >
              CSS
            </a>
            ,{" "}
            <a href="https://www.javascript.com/" style={{ color: "#ead41c" }}>
              JavaScript
            </a>
            ,{" "}
            <a href="https://reactjs.org/" style={{ color: "#2cafae" }}>
              React
            </a>
            ,{" "}
            */}
      </div>
    );
  }
  componentDidMount() {
    document.getElementById("isYears").addEventListener("click", () => {
      ReactTooltip.hide(this.ageRef);
    });
    // setTimeout(() => {
    //   $("#numberContainer1").animate(
    //     {
    //       scrollTop: $("#numberContainer1 #number1").offset().top,
    //     },
    //     "slow"
    //   );
    //   $("#numberContainer2").animate(
    //     {
    //       scrollTop: $("#numberContainer2 #number1").offset().top,
    //     },
    //     "slow"
    //   );
    //   $("#numberContainer3").animate(
    //     {
    //       scrollTop: $("#numberContainer3 #number1").offset().top,
    //     },
    //     "slow"
    //   );
    //   $("#numberContainer4").animate(
    //     {
    //       scrollTop: $("#numberContainer4 #number1").offset().top,
    //     },
    //     "slow"
    //   );
    // }, 500);
  }
  outsideClick(event, notelem) {
    notelem = $(notelem); // jquerize (optional)
    // check outside click for multiple elements
    var clickedOut = true,
      i,
      len = notelem.length;
    for (i = 0; i < len; i++) {
      if (event.target === notelem[i] || notelem[i].contains(event.target)) {
        clickedOut = false;
      }
    }
    if (clickedOut) return true;
    else return false;
  }
  handleClick2(that) {
    $("button").click(function () {
      $("#numberContainer1").animate(
        {
          scrollTop: $("#numberContainer1 #number6").offset().top,
        },
        "slow"
      );
      $("#numberContainer2").animate(
        {
          scrollTop: $("#numberContainer2 #number9").offset().top,
        },
        "slow"
      );
      $("#numberContainer3").animate(
        {
          scrollTop: $("#numberContainer3 #number6").offset().top,
        },
        "slow"
      );
      $("#numberContainer4").animate(
        {
          scrollTop: $("#numberContainer4 #number9").offset().top,
        },
        "slow"
      );
    });
  }
  handleClick(that) {
    console.log(that);
    if (that?.target?.className?.includes("skillBox")) {
      let id = that?.target?.id;
      $("#introduction").fadeOut(500);
      $("#skills").fadeOut(500);
      //   setTimeout(() => {
      //     $("#introduction").fadeIn(500);
      //     $("#skills").fadeIn(500);
      //   }, 2000);

      if (id === "htmlBox") {
        $("#HTMLSkillBox").fadeIn(500);
      } else if (id === "cssBox") {
        $("#CSSSkillBox").fadeIn(500);
      } else if (id === "jsBox") {
        $("#JSSkillBox").fadeIn(500);
      } else if (id === "nodejsBox") {
        $("#NodeJSSkillBox").fadeIn(500);
      } else if (id === "reactBox") {
        $("#ReactSkillBox").fadeIn(500);
      }
    } else if (that?.target?.className?.includes("closeX")) {
      let id = that?.target?.parentElement?.id;
      if (id === "HTMLSkillBox") {
        $("#HTMLSkillBox").fadeOut(500);
        $("#introduction").fadeIn(500);
        $("#skills").fadeIn(500);
      } else if (id === "CSSSkillBox") {
        $("#CSSSkillBox").fadeOut(500);
        $("#introduction").fadeIn(500);
        $("#skills").fadeIn(500);
      } else if (id === "JSSkillBox") {
        $("#JSSkillBox").fadeOut(500);
        $("#introduction").fadeIn(500);
        $("#skills").fadeIn(500);
      } else if (id === "NodeJSSkillBox") {
        $("#NodeJSSkillBox").fadeOut(500);
        $("#introduction").fadeIn(500);
        $("#skills").fadeIn(500);
      } else if (id === "ReactSkillBox") {
        $("#ReactSkillBox").fadeOut(500);
        $("#introduction").fadeIn(500);
        $("#skills").fadeIn(500);
      }
    }
  }
}
export default Main;
