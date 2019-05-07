import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
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

class Board extends React.Component {
  constructor(props) {
    super(props);

    // const cells = [
      // {key: 0, x: 0, y: 0, state: "empty"},
      // {key: 1, x: 1, y: 0, state: "empty"},
    // ];
    const cells = this.build_cells(5);
    this.state = {
      cells: cells,
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

  onMouseOver(key) {
    this.setState({
      cells: this.state.cells.map((cell) => cell.key === key ? {key: cell.key, x: cell.x, y: cell.y, state: "mouseover"} : cell),
    });
  }

  onMouseOut(key) {
    this.setState({
      cells: this.state.cells.map((cell) => cell.key === key ? {key: cell.key, x: cell.x, y: cell.y, state: "empty"} : cell),
    });
  }

  render() {
    const cells = this.state.cells.map((row, idx) => {
      return (
        <Cell key={row.key} x={row.x} y={row.y} state={row.state}
               onMouseOver={() => this.onMouseOver(row.key)}
               onMouseOut={() => this.onMouseOut(row.key)}
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

function Cell(props) {
  return (
    <li onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>{props.x},{props.y},{props.state}</li>
  );
}

export default App;
