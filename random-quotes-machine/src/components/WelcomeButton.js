import React from "react";
import "../styles/components/WelcomeButton.scss";

const WelcomeButton = (props) => {
  return (
    <button
      className={
        props.exitAnimation
          ? "animate__animated animate__flipOutX"
          : "animate__animated animate__bounceIn"
      }
      id="button_welcome"
      onClick={props.welcomeClickHandler}
    >
      Generate Quote
    </button>
  );
};

export default WelcomeButton;
