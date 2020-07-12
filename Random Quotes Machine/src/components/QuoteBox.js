import React from "react";
import "../styles/components/QuoteBox.scss";

const QuoteBox = (props) => {
  return (
    <div id="quote-box" className={"animate__animated animate__zoomInUp "}>
      <div className={props.fade ? "fade" : ""}>
        <p id="quotes">"</p>
        <p id="text">{props.quote.quote}</p>
        <p id="author">{props.quote.author}</p>
      </div>
      <div id="quote-box-buttons">
        <button id="quote-box-buttons--twitter" onClick={props.tweetAction}>
          Tweet
        </button>
        <button id="quote-box-buttons--next" onClick={props.getQuote}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default QuoteBox;
