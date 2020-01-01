import React, { Component } from "react";
import Head from "next/head";
import Loading from "../components/loading";
import "../styles/markov.css";

class Markov extends Component {
  constructor() {
    super();
    this.state = {
      map: null,
      message: "",
      loading: false
    };
  }

  async componentDidMount() {
    await this.loadMap();
    this.talk();
    document.addEventListener("keydown", e => this.spaceFunction(e), false);
  }

  loadMap() {
    const feed = require("../scripts/feed.json");
    this.setState({
      map: feed
    });
  }

  talk() {
    this.setState({ loading: true });

    const map = this.state.map;
    const len = Object.keys(map).length;
    const words = [Object.keys(map)[this.getRandom(0, len - 1)]];
    const sentenceLen = this.getRandom(4, 40);

    this.constructSentence(map, sentenceLen, words);

    const sentence = this.capitalizeFirstLetter(words.join(" ").trim() + ".");

    setTimeout(() => this.setState({ loading: false, message: sentence }), 900);
  }

  constructSentence(map, len, words) {
    if (len === 0 || !map.hasOwnProperty(words[words.length - 1])) {
      return;
    } else {
      const arr = map[words[words.length - 1]];
      words.push(arr[this.getRandom(0, arr.length - 1)]);
      this.constructSentence(map, len - 1, words);
    }
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  spaceFunction(event) {
    if (event.keyCode === 32) {
      this.talk();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", e => this.spaceFunction(e), false);
  }

  render() {
    const { message, loading } = this.state;

    return (
      <>
        <Head>
          <title>Markov</title>
        </Head>

        <div
          className="face"
          onKeyPress={this.handleKeyPress}
          onClick={() => this.talk()}
        >
          <div className="bubble">
            {loading ? <Loading /> : <span className="message">{message}</span>}
          </div>

          <div>Press Space/Click Screen for Next</div>
        </div>
      </>
    );
  }
}

export default Markov;
