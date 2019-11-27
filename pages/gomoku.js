import React, { Component } from "react";
import Head from "next/head";
import "../styles/gomoku.css";

class Gomoku extends Component {
  constructor() {
    super();
  }

  state = {
    pieces: Array.from(Array(15 * 15)),
    player: "black"
  };

  render() {
    const { pieces, player } = this.state;

    return (
      <>
        <Head>
          <title>Gomoku</title>
        </Head>

        <div className="flex">
          <div className="grid">
            {pieces.map((v, i) => {
              return (
                <div
                  key={i}
                  className={v ? (v == "black" ? "black" : "white") : ""}
                  onClick={() => {
                    pieces[i] = player;
                    this.setState({
                      player: player == "white" ? "black" : "white"
                    });
                  }}
                ></div>
              );
            })}
          </div>

          <div className="board">
            {Array.from(Array(14 * 14)).map((v, i) => (
              <div className="board-fr" key={i}></div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default Gomoku;
