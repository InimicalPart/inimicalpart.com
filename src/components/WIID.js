import ProgressBar from "@ramonak/react-progress-bar";
import prettyMilliseconds from "pretty-ms";
import React from "react";
import ReactTooltip from "react-tooltip";
function padZeros(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\?/g, "&#63;")
    .replace(/\//g, "&#47;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;");
}
let imgs = importAll(require.context("../img", false, /\.(png|jpe?g|svg)$/));
function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}
function getCanvasFontSize(el = document.body) {
  const fontWeight = el.style["font-weight"] || "normal";
  const fontSize = el.style["font-size"] || "16px";
  const fontFamily = el.style["font-family"] || "Times New Roman";

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}
let text = {
  LRG_IMG: "N/A",
  LRG_IMG_URL: "N/A",
  SML_IMG: "N/A",
  SML_IMG_URL: "N/A",
  AUTHOR_PIC_URL: "N/A",
  USERNAME: "N/A",
  STATUS: "N/A",
};
let timer = null;
let updateInfoRan = false;
let otherThis = null;
class WIID extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0,
      label: "N/A",
      endTime: "N/A",
    };
  }
  render() {
    console.log(imgs);
    otherThis = this;
    if (!updateInfoRan) setTimeout(this.updateInfo, 100);
    if (timer === null)
      timer = setInterval(
        this.updateInfo,
        parseInt(this.props.updateInterval) || 5000
      );
    return (
      <div
        id="WIID"
        style={{
          backgroundColor: this.props.color || "#121212",
          width: "30rem",
          height: "250px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "18px",
        }}
      >
        {/* <p style={{ color: "white" }}>
          <span data-tip="" id="WIID_NAME">
            <b>{text.USERNAME}</b>
          </span>{" "}
          is currently{" "}
          <span data-tip="" id="WIID_STATUS">
            <b>{text.STATUS}</b>
          </span>
        </p> */}
        <img
          id="WIID_AVATAR"
          data-tip=""
          alt="avatar"
          src={text.AUTHOR_PIC_URL}
          style={{
            borderRadius: "10vh",
            border: "#aaa 2px solid",
            height: "69px",
            position: "absolute",
            left: "21px",
            top: "65px",
            transform: "translate(0px, -50%)",
          }}
        />
        <p
          id="WIID_TAG"
          style={{
            color: this.props.textColor || "white",
            position: "absolute",
            left: "106px",
            top: "34px",
            transform: "translate(0px, -50%)",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          N/A
        </p>
        <img
          id="status_main"
          src=""
          alt="status"
          style={{
            // visibility: "hidden",
            width: "39px",
            position: "absolute",
            top: "85px",
            left: "65px",
            transform: "translate(0px, -50%)",
            zIndex: "1",
          }}
        />
        <div
          id="coverCircle"
          style={{
            width: "15px",
            height: "15px",
            position: "absolute",
            backgroundColor: this.props.color || "#000000",
            borderRadius: "10vh",
            top: "81px",
            left: "77px",
          }}
        ></div>
        <img
          id="status1"
          data-tip=""
          src=""
          alt="status"
          style={{
            visibility: "hidden",
            width: "24px",
            position: "absolute",
            top: "53px",
            left: "204px",
            transform: "translate(0px, -50%)",
          }}
        />
        <img
          id="status2"
          src=""
          data-tip=""
          alt="status"
          style={{
            visibility: "hidden",
            width: "24px",
            position: "absolute",
            top: "53px",
            left: "230px",
            transform: "translate(0px, -50%)",
          }}
        />
        <img
          id="status3"
          data-tip=""
          src=""
          alt="status"
          style={{
            visibility: "hidden",
            width: "24px",
            position: "absolute",
            top: "53px",
            left: "256px",
            transform: "translate(0px, -50%)",
          }}
        />
        <p
          id="WIID_CUSTOM_STATUS"
          data-tip=""
          style={{
            color: this.props.customStatusColor || "#ababab",
            position: "absolute",
            left: "106px",
            top: "58px",
            whiteSpace: "nowrap",
            transform: "translate(0px, -50%)",
            fontSize: "15px",
            visibility: "hidden",
          }}
        >
          N/A
        </p>
        <div
          id="activityData"
          style={{
            visibility: "visible",
            paddingBottom: "15px",
            backgroundColor: this.props.activityBackground || "#232323",
            paddingTop: "15px",
            borderBottomLeftRadius: "18px",
            borderBottomRightRadius: "18px",
            bottom: "0px",
            height: "100px",
            width: "480px",
            position: "absolute",
          }}
        >
          <div
            id="WIID_ACTIVITY_IMG"
            style={{ width: "100px", height: "100px", position: "relative" }}
          >
            <img
              id="WIID_LARGE_IMG"
              data-tip=""
              alt="avatar"
              //   ref={(ref) => (this.LargeTextTip = ref)}
              //   data-for="WIID_LARGE_TEXT_TIP"
              src={text.LRG_IMG_URL}
              style={{
                position: "absolute",
                height: "100%",
                borderRadius: "10px",
                marginLeft: "-30px",
                marginTop: "0px",
              }}
            />
            {/* <ReactTooltip id="WIID_LARGE_TEXT_TIP" effect="solid">
              <span>hello world</span>
            </ReactTooltip> */}
            <img
              id="WIID_SMALL_IMG"
              alt="avatar"
              src={text.SML_IMG_URL}
              data-tip=""
              style={{
                position: "absolute",
                zIndex: 5,
                marginLeft: "40%",
                marginTop: "70%",
                width: "35%",
                height: "35%",
                borderRadius: "10vh",
              }}
            />
            <p
              style={{
                position: "absolute",
                marginLeft: "140px",
                marginTop: "2px",
                color: this.props.textColor || "white",
              }}
              data-tip=""
              id="WIID_TITLE"
            >
              <b>N/A</b>
            </p>
            <p
              style={{
                position: "absolute",
                marginLeft: "140px",
                whiteSpace: "nowrap",
                marginTop: "25px",
                color: this.props.textColor || "white",
              }}
              data-tip=""
              id="WIID_DETAILS"
            >
              N/A
            </p>
            <p
              style={{
                position: "absolute",
                marginLeft: "140px",
                whiteSpace: "nowrap",
                marginTop: "45px",
                color: this.props.textColor || "white",
              }}
              data-tip=""
              id="WIID_STATE"
            >
              N/A
            </p>
            <p
              id="WIID_NDA"
              style={{
                position: "absolute",
                marginLeft: "140px",
                whiteSpace: "nowrap",
                marginTop: "10px",
                color: this.props.NDAColor || "#9a9a9a",
                visibility: "hidden",
                textDecoration:
                  "underline wavy " + (this.props.NDAWaveColor || "#676767"),
                textUnderlineOffset: "0.5rem",
                textDecorationThickness: "1px",
              }}
            >
              <i>Currently not doing anything</i>
            </p>
            <p
              style={{
                position: "absolute",
                marginLeft: "140px",
                whiteSpace: "nowrap",
                marginTop: "60px",
                color: this.props.textColor || "white",
                visibility: "hidden",
              }}
              id="WIID_TIMESTAMP"
            >
              N/A
            </p>
            <p
              style={{
                position: "absolute",
                marginLeft: "140px",
                whiteSpace: "nowrap",
                marginTop: "65px",
                color: this.props.textColor || "white",
                visibility: "hidden",
              }}
              id="WIID_SPOTIFY_PROGRESSBAR"
            >
              <ProgressBar
                id="Spotify_Progress"
                completed={this.state.progress}
                bgColor={this.props.progressColor || "#a73fbf"}
                height="10px"
                width="320px"
                isLabelVisible={true}
                customLabel={this.state.label}
                labelColor={this.props.progressLabelColor || "#ffffff"}
                labelSize="10px"
                animateOnRender
                transitionTimingFunction="ease"
                maxCompleted={100}
              />
            </p>
            <p
              style={{
                position: "absolute",
                marginLeft: "140px",
                whiteSpace: "nowrap",
                marginTop: "85px",
                color: this.props.textColor || "white",
                visibility: "hidden",
              }}
              id="WIID_SPOTIFY_START"
            >
              0:00
            </p>
            <p
              style={{
                position: "absolute",
                marginLeft: "432px",
                whiteSpace: "nowrap",
                marginTop: "85px",
                color: this.props.textColor || "white",
                visibility: "hidden",
              }}
              id="WIID_SPOTIFY_END"
            >
              {this.state.endTime}
            </p>
          </div>
        </div>
        <ReactTooltip effect="solid" />
      </div>
    );
  }
  tick() {}
  updateInfo() {
    updateInfoRan = true;
    if (document.getElementById("activityData")) {
      //get json data from https://api.inimicalpart.com/v1/presence/814623079346470993
      fetch("https://api.inimicalpart.com/v1/presence/814623079346470993")
        .then((response) => response.json())
        .then((data) => {
          text.STATUS = data.status;
          document.getElementById("status_main").src =
            imgs[text.STATUS + ".svg"];
          document.getElementById("status1").src =
            Object.keys(data.client_status).length >= 1
              ? imgs[
                  data.client_status[Object.keys(data.client_status)[0]] +
                    "_" +
                    Object.keys(data.client_status)[0] +
                    ".png"
                ]
              : "";
          document.getElementById("status2").src =
            Object.keys(data.client_status).length >= 2
              ? imgs[
                  data.client_status[Object.keys(data.client_status)[1]] +
                    "_" +
                    Object.keys(data.client_status)[1] +
                    ".png"
                ]
              : "";
          document.getElementById("status3").src =
            Object.keys(data.client_status).length === 3
              ? imgs[
                  data.client_status[Object.keys(data.client_status)[2]] +
                    "_" +
                    Object.keys(data.client_status)[2] +
                    ".png"
                ]
              : "";
          if (document.getElementById("status1").src.startsWith("data")) {
            if (
              document.getElementById("status1").style.visibility === "hidden"
            )
              document.getElementById("status1").style.visibility = "visible";
          } else {
            if (
              document.getElementById("status1").style.visibility === "visible"
            )
              document.getElementById("status1").style.visibility = "hidden";
          }
          if (document.getElementById("status2").src.startsWith("data")) {
            if (
              document.getElementById("status2").style.visibility === "hidden"
            )
              document.getElementById("status2").style.visibility = "visible";
          } else {
            if (
              document.getElementById("status2").style.visibility === "visible"
            )
              document.getElementById("status2").style.visibility = "hidden";
          }
          if (document.getElementById("status3").src.startsWith("data")) {
            if (
              document.getElementById("status3").style.visibility === "hidden"
            )
              document.getElementById("status3").style.visibility = "visible";
          } else {
            if (
              document.getElementById("status3").style.visibility === "visible"
            )
              document.getElementById("status3").style.visibility = "hidden";
          }

          document.getElementById("WIID_TAG").innerHTML =
            "<b>" + data.user.username + "#" + data.user.discriminator + "</b>";
          //status 1: 107 + getTextWidth(document.getElementById("WIID_TAG").innerText, getCanvasFontSize(document.getElementById("WIID_TAG"))) + 15
          //status 2: status 1 + 26 px offset
          //status 3: status 2 + 26 px offset
          document.getElementById("status1").style.left =
            107 +
            getTextWidth(
              document.getElementById("WIID_TAG").innerText,
              getCanvasFontSize(document.getElementById("WIID_TAG"))
            ) +
            15 +
            "px";
          document.getElementById("status2").style.left =
            107 +
            getTextWidth(
              document.getElementById("WIID_TAG").innerText,
              getCanvasFontSize(document.getElementById("WIID_TAG"))
            ) +
            41 +
            "px";
          document.getElementById("status3").style.left =
            107 +
            getTextWidth(
              document.getElementById("WIID_TAG").innerText,
              getCanvasFontSize(document.getElementById("WIID_TAG"))
            ) +
            67 +
            "px";

          text.USERNAME = data.user.username + "#" + data.user.discriminator;
          if (data.custom_status) {
            let setText = "";
            let fullSetText = "";
            let setSize = "";
            let needHoverforfull = false;
            if (data.custom_status.emoji) {
              setText =
                data.custom_status.emoji.name + " " + data.custom_status.state;
              if (
                getTextWidth(
                  setText,
                  getCanvasFontSize(
                    document.getElementById("WILD_CUSTOM_STATUS")
                  )
                ) > 300
              ) {
                //remove one character from the end of the string until it fits. must have "..." at the end and still fit
                needHoverforfull = true;
                fullSetText =
                  data.custom_status.emoji.name +
                  " " +
                  data.custom_status.state;
                while (
                  getTextWidth(
                    setText,
                    getCanvasFontSize(
                      document.getElementById("WILD_CUSTOM_STATUS")
                    )
                  ) > 300
                ) {
                  setText = setText.substring(0, setText.length - 1);
                }
                setText = setText + "...";
              }
              setSize = "103px";
            } else {
              setText = data.custom_status.state;
              if (
                getTextWidth(
                  setText,
                  getCanvasFontSize(
                    document.getElementById("WIID_CUSTOM_STATUS")
                  )
                ) > 300
              ) {
                needHoverforfull = true;
                fullSetText = data.custom_status.state;
                //remove one character from the end of the string until it fits. must have "..." at the end and still fit
                while (
                  getTextWidth(
                    setText,
                    getCanvasFontSize(
                      document.getElementById("WIID_CUSTOM_STATUS")
                    )
                  ) > 300
                ) {
                  setText = setText.substring(0, setText.length - 1);
                }
                setText = setText + "...";
              }
              setSize = "106px";
            }
            document.getElementById("WIID_CUSTOM_STATUS").innerHTML = setText;
            document.getElementById("WIID_CUSTOM_STATUS").style.left = setSize;
            document.getElementById("WIID_CUSTOM_STATUS").style.visibility =
              "visible";
            if (needHoverforfull)
              document.getElementById("WIID_CUSTOM_STATUS").dataset.tip =
                fullSetText;
            //set WIID_TAG.styte.top to 46px
            document.getElementById("WIID_TAG").style.top = "34px";
            //set status1,2,3 to top 34px
            document.getElementById("status1").style.top = "53px";
            document.getElementById("status2").style.top = "53px";
            document.getElementById("status3").style.top = "53px";
          } else {
            document.getElementById("WIID_CUSTOM_STATUS").style.visibility =
              "hidden";
            //set WIID_TAG.styte.top to 34px
            document.getElementById("WIID_TAG").style.top = "46px";
            //set status1,2,3 to top 46px
            document.getElementById("status1").style.top = "66px";
            document.getElementById("status2").style.top = "66px";
            document.getElementById("status3").style.top = "66px";
          }
          document.getElementById("WIID_AVATAR").src = data.user.image;
          document.getElementById("WIID_AVATAR").dataset.tip = "testing string";
          if (data.activity && data.activity.activity_data.name !== "Spotify") {
            //make activityData div invisible
            document.getElementById("activityData").style.visibility =
              "visible";
            //hide state and details
            document.getElementById("WIID_STATE").style.visibility = "hidden";
            document.getElementById("WIID_DETAILS").style.visibility =
              "visible";
            //hide timestamp
            document.getElementById("WIID_TIMESTAMP").style.visibility =
              "hidden";
            //hide spotify progress
            document.getElementById(
              "WIID_SPOTIFY_PROGRESSBAR"
            ).style.visibility = "hidden";
            document.getElementById("WIID_SPOTIFY_START").style.visibility =
              "hidden";
            document.getElementById("WIID_SPOTIFY_END").style.visibility =
              "hidden";
            //hide small image
            document.getElementById("WIID_SMALL_IMG").style.visibility =
              "visible";
            //show WIID_NDA
            document.getElementById("WIID_NDA").style.visibility = "hidden";
            document.getElementById("WIID_LARGE_IMG").src =
              data.activity.activity_data.assets.large_image;
            document.getElementById("WIID_SMALL_IMG").src =
              data.activity.activity_data.assets.small_image;
            document.getElementById("WIID_SMALL_IMG").dataset.tip =
              data.activity.activity_data.assets.small_text;
            document.getElementById("WIID_LARGE_IMG").dataset.tip =
              data.activity.activity_data.assets.large_text;
            let titleText = data.activity.activity_data.name;
            let fullTitleText = data.activity.activity_data.name;
            let titleHoverForFull = false;
            if (
              getTextWidth(
                titleText,
                getCanvasFontSize(document.getElementById("WIID_TITLE"))
              ) > 250
            ) {
              //remove one character from the end of the string until it fits. must have "..." at the end and still fit
              titleHoverForFull = true;
              while (
                getTextWidth(
                  titleText,
                  getCanvasFontSize(document.getElementById("WIID_TITLE"))
                ) > 250
              ) {
                titleText = titleText.substring(0, titleText.length - 1);
              }
              titleText = titleText + "...";
            }
            document.getElementById("WIID_TITLE").innerHTML =
              "<b>" + titleText + "</b>";
            if (titleHoverForFull)
              document.getElementById("WIID_TITLE").dataset.tip = fullTitleText;
            // document.getElementById("WIID_DETAILS").innerHTML =
            //   data.activity.activity_data.details +
            //   "<br>" +
            //   data.activity.activity_data.state;
            if (
              data.activity.activity_data.state &&
              data.activity.activity_data.details
            ) {
              //set the WIID divs height to be 50px higher
              document.getElementById("WIID").style.height = "250px";
              //move the large image and small image 50 px down
              //   document.getElementById("WIID_ACTIVITY_IMG").style.marginTop =
              //     "50px";
              //move timestamp 50px down
              document.getElementById("WIID_TIMESTAMP").style.marginTop =
                "70px";
              document.getElementById("WIID_STATE").style.visibility =
                "visible";
              let stateText = data.activity.activity_data.state;
              let fullStateText = data.activity.activity_data.state;
              let stateHoverForFull = false;
              if (
                getTextWidth(
                  stateText,
                  getCanvasFontSize(document.getElementById("WIID_STATE"))
                ) > 250
              ) {
                //remove one character from the end of the string until it fits. must have "..." at the end and still fit
                stateHoverForFull = true;
                while (
                  getTextWidth(
                    stateText,
                    getCanvasFontSize(document.getElementById("WIID_STATE"))
                  ) > 250
                ) {
                  stateText = stateText.substring(0, stateText.length - 1);
                }
                stateText = stateText + "...";
              }
              document.getElementById("WIID_STATE").innerHTML =
                escapeHTML(stateText);
              if (stateHoverForFull)
                document.getElementById("WIID_STATE").dataset.tip =
                  fullStateText;

              let detailsText = data.activity.activity_data.details;
              let fullDetailsText = data.activity.activity_data.details;
              let detailsHoverForFull = false;
              if (
                getTextWidth(
                  detailsText,
                  getCanvasFontSize(document.getElementById("WIID_DETAILS"))
                ) > 250
              ) {
                //remove one character from the end of the string until it fits. must have "..." at the end and still fit
                detailsHoverForFull = true;
                while (
                  getTextWidth(
                    detailsText,
                    getCanvasFontSize(document.getElementById("WIID_DETAILS"))
                  ) > 250
                ) {
                  detailsText = detailsText.substring(
                    0,
                    detailsText.length - 1
                  );
                }
                detailsText = detailsText + "...";
              }
              document.getElementById("WIID_DETAILS").innerHTML =
                escapeHTML(detailsText);
              if (detailsHoverForFull)
                document.getElementById("WIID_DETAILS").dataset.tip =
                  fullDetailsText;
              else document.getElementById("WIID_DETAILS").dataset.tip = "";
            } else {
              //set the WIID divs height to be 300px
              document.getElementById("WIID").style.height = "250px";
              //move the large image and small image 50 px down
              document.getElementById("WIID_ACTIVITY_IMG").style.marginTop =
                "0px";
              //move timestamp 50px down
              document.getElementById("WIID_TIMESTAMP").style.marginTop =
                "50px";
              //if only details set WIID_DETAILS to it, if only state, set it to state
              if (data.activity.activity_data.state) {
                let stateText = data.activity.activity_data.state;
                let fullStateText = data.activity.activity_data.state;
                let stateHoverForFull = false;
                if (
                  getTextWidth(
                    stateText,
                    getCanvasFontSize(document.getElementById("WIID_STATE"))
                  ) > 250
                ) {
                  //remove one character from the end of the string until it fits. must have "..." at the end and still fit
                  stateHoverForFull = true;
                  while (
                    getTextWidth(
                      stateText,
                      getCanvasFontSize(document.getElementById("WIID_STATE"))
                    ) > 250
                  ) {
                    stateText = stateText.substring(0, stateText.length - 1);
                  }
                  stateText = stateText + "...";
                }
                document.getElementById("WIID_STATE").innerHTML =
                  escapeHTML(stateText);
                if (stateHoverForFull)
                  document.getElementById("WIID_STATE").dataset.tip =
                    fullStateText;
                else document.getElementById("WIID_STATE").dataset.tip = "";
              } else if (data.activity.activity_data.details) {
                let detailsText = data.activity.activity_data.details;
                let fullDetailsText = data.activity.activity_data.details;
                let detailsHoverForFull = false;
                if (
                  getTextWidth(
                    detailsText,
                    getCanvasFontSize(document.getElementById("WIID_DETAILS"))
                  ) > 250
                ) {
                  //remove one character from the end of the string until it fits. must have "..." at the end and still fit
                  detailsHoverForFull = true;
                  while (
                    getTextWidth(
                      detailsText,
                      getCanvasFontSize(document.getElementById("WIID_DETAILS"))
                    ) > 250
                  ) {
                    detailsText = detailsText.substring(
                      0,
                      detailsText.length - 1
                    );
                  }
                  detailsText = detailsText + "...";
                }
                document.getElementById("WIID_DETAILS").innerHTML =
                  escapeHTML(detailsText);
                if (detailsHoverForFull)
                  document.getElementById("WIID_DETAILS").dataset.tip =
                    fullDetailsText;
                else document.getElementById("WIID_DETAILS").dataset.tip = "";
              }
            }
            if (
              data.activity.activity_data.timestamps.start ||
              data.activity.activity_data.timestamps.end
            ) {
              //if start is there, then make it says [Math.abs(time-new Date().getTime())] elapsed
              //if end is there, then make it says [new Date().getTime()-time] remaining
              if (data.activity.activity_data.timestamps.start) {
                let time = prettyMilliseconds(
                  Math.abs(
                    data.activity.activity_data.timestamps.start -
                      new Date().getTime()
                  ),
                  {
                    colonNotation: true,
                    compact: true,
                    secondsDecimalDigits: 0,
                  }
                );
                time = time.split(":");
                //pad all items in time array with 0 so that it is always 2 digits
                for (let i = 0; i < time.length; i++) {
                  time[i] = padZeros(time[i], 2);
                }
                //join the array back together
                time = time.join(":");

                document.getElementById("WIID_TIMESTAMP").innerHTML =
                  "<b>" + time + "</b> elapsed";
              } else if (data.activity.activity_data.timestamps.end) {
                let time = prettyMilliseconds(
                  Math.abs(
                    new Date().getTime() -
                      data.activity.activity_data.timestamps.end
                  ),
                  {
                    colonNotation: true,
                    compact: true,
                    secondsDecimalDigits: 0,
                  }
                );
                time = time.split(":");
                //pad all items in time array with 0 so that it is always 2 digits
                for (let i = 0; i < time.length; i++) {
                  time[i] = padZeros(time[i], 2);
                }
                //join the array back together
                time = time.join(":");

                document.getElementById("WIID_TIMESTAMP").innerHTML =
                  "<b>" + time + "</b> remaining";
              }
              document.getElementById("WIID_TIMESTAMP").style.visibility =
                "visible";
            }
          } else if (
            data.activity &&
            data.activity.activity_data.name === "Spotify"
          ) {
            //make activityData div invisible
            document.getElementById("activityData").style.visibility =
              "visible";
            //hide state and details
            document.getElementById("WIID_STATE").style.visibility = "visible";
            document.getElementById("WIID_DETAILS").style.visibility =
              "visible";
            //hide timestamp
            document.getElementById("WIID_TIMESTAMP").style.visibility =
              "hidden";
            document.getElementById("WIID_SPOTIFY_START").style.visibility =
              "visible";
            document.getElementById("WIID_SPOTIFY_END").style.visibility =
              "visible";
            //hide spotify progress
            document.getElementById(
              "WIID_SPOTIFY_PROGRESSBAR"
            ).style.visibility = "visible";
            //hide small image
            document.getElementById("WIID_SMALL_IMG").style.visibility =
              "hidden";
            //show WIID_NDA
            document.getElementById("WIID_NDA").style.visibility = "hidden";
            //hide the small image, and set the big one to data.activity.external_data.song.image
            document.getElementById("WIID_SMALL_IMG").style.visibility =
              "hidden";
            document.getElementById("WIID_LARGE_IMG").src =
              data.activity.external_data.song.image;
            document.getElementById("WIID_LARGE_IMG").dataset.tip =
              data.activity.external_data.song.name;
            document.getElementById("WIID_TITLE").innerHTML =
              "<b>" + data.activity.activity_data.name + "</b>";
            document.getElementById("WIID_STATE").style.visibility = "visible";
            document.getElementById("WIID_DETAILS").style.visibility =
              "visible";
            let stateText = data.activity.external_data.song.author;
            let fullStateText = data.activity.external_data.song.author;
            let stateHoverForFull = false;
            if (
              getTextWidth(
                stateText,
                getCanvasFontSize(document.getElementById("WIID_STATE"))
              ) > 250
            ) {
              //remove one character from the end of the string until it fits. must have "..." at the end and still fit
              stateHoverForFull = true;
              while (
                getTextWidth(
                  stateText,
                  getCanvasFontSize(document.getElementById("WIID_STATE"))
                ) > 250
              ) {
                stateText = stateText.substring(0, stateText.length - 1);
              }
              stateText = stateText + "...";
            }
            document.getElementById("WIID_STATE").innerHTML =
              escapeHTML(stateText);
            if (stateHoverForFull)
              document.getElementById("WIID_STATE").dataset.tip = fullStateText;
            else document.getElementById("WIID_STATE").dataset.tip = "";
            let detailsText = data.activity.external_data.song.name;
            let fullDetailsText = data.activity.external_data.song.name;
            let detailsHoverForFull = false;
            if (
              getTextWidth(
                detailsText,
                getCanvasFontSize(document.getElementById("WIID_DETAILS"))
              ) > 250
            ) {
              //remove one character from the end of the string until it fits. must have "..." at the end and still fit
              detailsHoverForFull = true;
              while (
                getTextWidth(
                  detailsText,
                  getCanvasFontSize(document.getElementById("WIID_DETAILS"))
                ) > 250
              ) {
                detailsText = detailsText.substring(0, detailsText.length - 1);
              }
              detailsText = detailsText + "...";
            }
            document.getElementById("WIID_DETAILS").innerHTML =
              escapeHTML(detailsText);
            if (detailsHoverForFull)
              document.getElementById("WIID_DETAILS").dataset.tip =
                fullDetailsText;
            else document.getElementById("WIID_DETAILS").dataset.tip = "";
            //the timestamp needs to become a progress bar / slider that goes from 0 to 100
            document.getElementById(
              "WIID_SPOTIFY_PROGRESSBAR"
            ).style.visibility = "visible";
            document.getElementById(
              "WIID_SPOTIFY_PROGRESSBAR"
            ).style.marginTop = "75px";
            let start = data.activity.activity_data.timestamps.start;
            let current =
              data.activity.activity_data.timestamps.end -
              data.activity.activity_data.timestamps.start -
              (data.activity.activity_data.timestamps.end -
                data.activity.activity_data.timestamps.start -
                (Date.now() - data.activity.activity_data.timestamps.start));
            let end = data.activity.activity_data.timestamps.end;
            let percent = (current / (end - start)) * 100;
            let label = data.activity.external_data.song.current;
            let endTime = data.activity.external_data.song.end;
            if (label.startsWith("0")) {
              label = label.substring(1);
            }
            if (endTime.startsWith("0")) {
              endTime = endTime.substring(1);
            }
            otherThis.setState({
              progress: percent,
              label: label,
              endTime: endTime,
            });
          } else {
            //make activityData div invisible
            document.getElementById("activityData").style.visibility = "hidden";
            //hide state and details
            document.getElementById("WIID_STATE").style.visibility = "hidden";
            document.getElementById("WIID_DETAILS").style.visibility = "hidden";
            //hide timestamp
            document.getElementById("WIID_TIMESTAMP").style.visibility =
              "hidden";
            //hide spotify progress
            document.getElementById(
              "WIID_SPOTIFY_PROGRESSBAR"
            ).style.visibility = "hidden";
            //hide small image
            document.getElementById("WIID_SMALL_IMG").style.visibility =
              "hidden";
            //show WIID_NDA
            document.getElementById("WIID_NDA").style.visibility = "visible";
            document.getElementById("WIID_SPOTIFY_START").style.visibility =
              "hidden";
            document.getElementById("WIID_SPOTIFY_END").style.visibility =
              "hidden";
          }
        });
    }
  }
}
export default WIID;
