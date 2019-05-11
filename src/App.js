import React from 'react';
import logo from './logo.svg';
import './App.css';

export function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
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

    this.state = {
      walkers: [
        {x: 1, y: 0, color: "R"},
        {x: 2, y: 0, color: "R"},
      ],
    };
    const cells = this.build_cells(5);
    this.state = {
      cells: cells,
      walkers: this.state.walkers,
    };
  }

  build_cells(size) {
    const range = (n) => Array.from({length: n}, (v, k) => k);
    return range(size).reduce((p, c, y) => {
      return p.concat(range(Math.ceil(size / 2) + Math.min(y, size - y - 1)).map((row, base_x) => {
        const x = base_x + Math.max(0, y - Math.floor(size / 2));

        var state = "empty";
        const content = this.find_content(x, y);
        if (content) {
          if (content.type == "walker") {
            state = content.content.color;
          }
        }
        return {key: "(" + x + "," + y + ")", x: x, y: y, state: state};
      }))
    }, []);
  }

  find_content(x, y) {
    const walker = this.state.walkers.filter((w) => (w.x == x && w.y == y))[0];
    if (walker) {
      return {type: "walker", content: walker}
    }
    return null;
  }


  render() {
    const cells = this.state.cells.map((row) => {
      return (
        <Cell key={row.key} x={row.x} y={row.y} state={row.state}>
        </Cell>
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
      state: props.state,
    }
  }

  onMouseOver() {
    this.setState({
      state: "mouseover",
    });
  }

  onMouseOut() {
    this.setState({
      state: this.props.state
    });
  }

  render() {
    return (
      <li data-testid={"cell_" + this.props.x + "_" + this.props.y} onMouseOver={() => this.onMouseOver()}
          onMouseOut={() => this.onMouseOut()}>
        {this.props.x},{this.props.y},{this.state.state}
        {
          this.props.state == "R" ? <Walker color={this.props.state}/> : ""
        }
      </li>
    );
  }
}

export class Walker extends React.Component {
  render() {
    return <div>Walker {this.props.color}</div>
  }

}

export default App;
