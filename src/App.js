import React from 'react';
import logo from './logo.svg';
import './App.css';

export function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Board></Board>
    </div>
  );
}

export class Board extends React.Component {
  constructor(props) {
    super(props);

    // const cells = [
      // {key: 0, x: 0, y: 0, state: "empty"},
      // {key: 1, x: 1, y: 0, state: "empty"},
    // ];
    const cells = this.build_cells(5);
    this.state = {
      cells: cells,
      walkers: [
        { x: 1, y: 0, color: "R" },
      ],
    };
  }

  build_cells(size) {
    const range = (n) => Array.from({length: n}, (v, k) => k);
    return range(size).reduce((p, c, y) => {
      return p.concat(range(Math.ceil(size / 2) + Math.min(y, size - y - 1)).map((row, base_x) => {
        const x = base_x + Math.max(0, y - Math.floor(size / 2));
        return {key: "(" + x + "," + y + ")", x: x, y: y, state: "empty"};
      }))
    }, []);
  }


  render() {
    const cells = this.state.cells.map((row, idx) => {
      return (
        <Cell key={row.key} x={row.x} y={row.y} state={row.state}
        />
      )
    });
    return (
      <ul>
        {cells}
      </ul>
    );
  }
}


export class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      state: "empty",
    }
  }

  onMouseOver() {
    this.setState({
      x: this.state.x,
      y: this.state.y,
      state: "mouseover",
    });
  }

  onMouseOut() {
    this.setState({
      x: this.state.x,
      y: this.state.y,
      state: "empty",
    });
  }

  render() {
    return (
    <li onMouseOver={() => this.onMouseOver()} onMouseOut={() => this.onMouseOut()}>{this.state.x},{this.state.y},{this.state.state}</li>
    );
  }
}


