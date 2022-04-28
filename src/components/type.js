import React from "react";
import uniqid from "uniqid";
import styles from "./type.module.css";
let textId = uniqid();
let cursorId = uniqid();
class Type extends React.Component {
  render() {
    return (
      <div id="container">
        <b>
          <div
            style={this.props.styleText}
            className={styles.text}
            id={textId}
          ></div>
          <div
            style={this.props.styleCursor}
            className={styles.cursor}
            id={cursorId}
          ></div>
        </b>
      </div>
    );
  }
  componentDidMount() {
    var _CONTENT = this.props.content || [
      "websites.",
      "apps.",
      "games.",
      "APIs.",
    ];
    var _PREFIX = this.props.prefix || "Hello, I work on ";

    // Current sentence being processed
    var _PART = 0;

    // Character number of the current sentence being processed
    var _PART_INDEX = 0;

    // Holds the handle returned from setInterval
    var _INTERVAL_VAL;

    // Element that holds the text
    var _ELEMENT = document.querySelector("#" + textId);

    // Cursor element

    // Implements typing effect
    function Type() {
      // Get substring with 1 characater added
      var text = _CONTENT[_PART].substring(0, _PART_INDEX + 1);
      _ELEMENT.innerHTML = _PREFIX + text;
      _PART_INDEX++;

      // If full sentence has been displayed then start to delete the sentence after some time
      if (text === _CONTENT[_PART]) {
        // Hide the cursor

        clearInterval(_INTERVAL_VAL);
        setTimeout(function () {
          _INTERVAL_VAL = setInterval(Delete, 50);
        }, 1500);
      }
    }

    // Implements deleting effect
    function Delete() {
      // Get substring with 1 characater deleted
      var text = _CONTENT[_PART].substring(0, _PART_INDEX - 1);
      _ELEMENT.innerHTML = _PREFIX + text;
      _PART_INDEX--;

      // If sentence has been deleted then start to display the next sentence
      if (text === "") {
        clearInterval(_INTERVAL_VAL);

        // If current sentence was last then display the first one, else move to the next
        if (_PART === _CONTENT.length - 1) _PART = 0;
        else _PART++;

        _PART_INDEX = 0;

        // Start to display the next sentence after some time
        setTimeout(function () {
          _INTERVAL_VAL = setInterval(Type, 100);
        }, 200);
      }
    }

    // Start the typing effect on load
    _INTERVAL_VAL = setInterval(typePrefix, 50);
    // quickly type the prefix, when done, start the Type function with interval of 100ms

    function typePrefix() {
      var text = _PREFIX.substring(0, _PART_INDEX + 1);
      _ELEMENT.innerHTML = text;
      _PART_INDEX++;

      if (text === _PREFIX) {
        _PART_INDEX = 0;
        clearInterval(_INTERVAL_VAL);
        _INTERVAL_VAL = setInterval(Type, 100);
      }
    }
  }
}
export default Type;
