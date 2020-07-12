import React from "react";
import WelcomeButton from "./WelcomeButton";
import QuoteBox from "./QuoteBox";
import quotes from "../assets/quotes.json";

class MainPage extends React.Component {
  state = {
    welcome: true,
    exitAnimation: false,
    fade: false,
    quote: null,
  };

  welcomeClickHandler = () => {
    this.getQuote();
    this.setState(() => ({
      exitAnimation: true,
    }));
    setTimeout(() => this.setState(() => ({ welcome: false })), 700);
  };

  getQuote = () => {
    const quotesList = quotes.quotes;
    const listLength = quotesList.length;
    let randIndex = Math.floor(Math.random() * listLength);

    if (this.state.quote && randIndex === this.state.quote.index) {
      while (randIndex === this.state.quote.index) {
        randIndex = Math.floor(Math.random() * listLength);
      }
    }

    // prevent multiple clicks
    if (!this.state.fade) {
      this.setState(() => ({ fade: true }));
      setTimeout(
        () =>
          this.setState(() => ({
            quote: { ...quotesList[randIndex], index: randIndex },
          })),
        500
      );
      setTimeout(() => this.setState(() => ({ fade: false })), 1000);
    }
  };
  tweetAction = () => {
    window.open(
      encodeURI(
        "https://twitter.com/intent/tweet?text=" +
          this.state.quote.quote +
          "&hashtags=Quotes"
      ),
      "_blank"
    );
  };
  render() {
    return (
      <div>
        {this.state.welcome && (
          <WelcomeButton
            exitAnimation={this.state.exitAnimation}
            welcomeClickHandler={this.welcomeClickHandler}
          />
        )}
        {!this.state.welcome && (
          <QuoteBox
            getQuote={this.getQuote}
            quote={this.state.quote}
            fade={this.state.fade}
            tweetAction={this.tweetAction}
          />
        )}
      </div>
    );
  }
}
export default MainPage;
