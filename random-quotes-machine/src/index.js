import React from "react";
import ReactDOM from "react-dom";
import "./styles/main.scss";
import * as serviceWorker from "./serviceWorker";
import MainPage from "./components/MainPage";
import "normalize.css";
import "animate.css";
import "./styles/main.scss";

ReactDOM.render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
