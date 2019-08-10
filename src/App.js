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
      <Board/>
    </div>
  );
}

class Dir {
  static nw(x, y) { return { x: x - 1, y: y - 1}; }
  static ne(x, y) { return { x: x, y: y - 1}; }
  static w(x, y) { return { x: x - 1, y: y}; }
  static e(x, y) { return { x: x + 1, y: y}; }
  static sw(x, y) { return { x: x, y: y + 1}; }
  static se(x, y) { return { x: x + 1, y: y + 1}; }
  static all(x, y) { return  [Dir.nw, Dir.ne, Dir.w, Dir.e, Dir.sw, Dir.se ].map(d => d(x, y)); }
}

export class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cells: this.build_cells(5),
      walkers: [
        {x: 1, y: 0, color: "R", state: "unselected"},
        {x: 2, y: 0, color: "R", state: "unselected"},
      ],
    };
  }

  build_cells(size) {
    const range = (n) => Array.from({length: n}, (v, k) => k);
    return range(size).reduce((p, c, y) => {
      range(Math.ceil(size / 2) + Math.min(y, size - y - 1)).forEach((row, base_x) => {
        const x = base_x + Math.max(0, y - Math.floor(size / 2));
        const key = `(${x},${y})`;
        p[key] = {key: key, x: x, y: y, state: "empty"};
      });
      return p;
    }, {});
  }

  move_walker(x, y) {
    const new_cells = {...this.state.cells};
    Object.entries(new_cells).forEach((e) => {
      e[1].state = "empty";
    });
    this.setState((state) => ({
      walkers: state.walkers.map((walker) => {
        if (walker.state === "selected") {
          return {...walker, x: x, y: y, state: "unselected"};
        } else {
          return walker;
        }
      }),
      cells: new_cells,
    }));
  }

  select_walker(x, y) {
    this.setState((state) => ({
      walkers: state.walkers.map((walker) => {
        if (walker.x === x && walker.y === y) {
          return {...walker, state: "selected"};
        } else {
          return walker;
        }
      })
    }));

    this.setState((state) => {
      const new_cells = {...state.cells};
      Dir.all(x, y).forEach((v) => {
          const key = `(${v.x},${v.y})`;
          if(new_cells[key]) {
            new_cells[key] = {...new_cells[key], state: "movearea"};
          }
      });
      return {
        cells: new_cells
      };
    });
  }

  find_content(x, y) {
    const walker = this.state.walkers.filter((w) => (w.x === x && w.y === y))[0];
    if (walker) {
      return {type: "walker", content: walker};
    }
    return null;
  }


  render() {
    const cells = Object.entries(this.state.cells).map(entry => {
      const row = entry[1];
      let walker = {};
      const content = this.find_content(row.x, row.y);
      if (content) {
        if (content.type === "walker") {
          walker = {
            color: content.content.color,
            state: content.content.state,
            onClick: () => {
              this.select_walker(row.x, row.y);
            }
          };
        }
      }
      return (
        <Cell key={row.key} x={row.x} y={row.y} state={row.state} content={walker}
              onClick={() => {
                this.move_walker(row.x, row.y);
              }}
        >
          {
            walker.color === "R" ?
              <Walker onClick={walker.onClick} color={walker.color}
                      state={walker.state}/> : ""
          }
        </Cell>
      );
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
      state: null
    };
  }

  onMouseOver() {
    this.setState({
      state: "mouseover",
    });
  }

  onMouseOut() {
    this.setState({
      state: null
    });
  }

  render() {
    let classes = [];
    if(this.props.state == 'empty') {
      classes.push('empty');
    }
    if(this.props.state == 'movearea') {
      classes.push('movearea');
    }
    if(this.state.state == 'mouseover') {
      classes.push('mouseover');
    }
    return (
      <li data-testid={"cell_" + this.props.x + "_" + this.props.y}
          onMouseOver={() => this.onMouseOver()}
          onMouseOut={() => this.onMouseOut()}
          onClick={this.props.onClick}
          className={classes.join(' ')}
      >
        {this.props.x},{this.props.y}
        {this.props.children}
      </li>
    );
  }
}

export class Walker extends React.Component {
  render() {
    return <div onClick={(e) => {
      e.stopPropagation();
      this.props.onClick();
    }}>Walker {this.props.color} {this.props.state}</div>;
  }

}

export default App;
