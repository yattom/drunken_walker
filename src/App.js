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
  //@formatter:off
  static nw(x, y) { return { x: x - 1, y: y - 1}; }
  static ne(x, y) { return { x: x, y: y - 1}; }
  static w(x, y) { return { x: x - 1, y: y}; }
  static e(x, y) { return { x: x + 1, y: y}; }
  static sw(x, y) { return { x: x, y: y + 1}; }
  static se(x, y) { return { x: x + 1, y: y + 1}; }
  static all(x, y) { return  [Dir.nw, Dir.ne, Dir.w, Dir.e, Dir.sw, Dir.se ].map(d => d(x, y)); }
  //@formatter:off
}

export const Model = {
  Walker: class {
    constructor(name, x, y, color) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.color = color;
      Object.freeze(this);
    }

    moved(x, y) {
      return new Model.Walker(this.name, x, y, this.color);
    }
  },

  Cell: class {
    constructor(key, x, y, state) {
      this.key = key;
      this.x = x;
      this.y = y;
      this.state = state;
      Object.freeze(this);
    }

    emptied() {
      return new Model.Cell(this.key, this.x, this.y, "empty");
    }

    movearea_ed() {
      return new Model.Cell(this.key, this.x, this.y, "movearea");
    }
  },

  build_cells: function(size) {
    const range = (n) => Array.from({length: n}, (v, k) => k);
    return range(size).reduce((p, c, y) => {
      range(Math.ceil(size / 2) + Math.min(y, size - y - 1)).forEach((row, base_x) => {
        const x = base_x + Math.max(0, y - Math.floor(size / 2));
        const key = `(${x},${y})`;
        p[key] = new Model.Cell(key, x, y, "empty");
      });
      return p;
    }, {});
  },

  empty_cells: function(cells) {
    const new_cells = {};
    Object.entries(cells).forEach((e) => {
      const key = e[0];
      const cell = e[1];
      new_cells[key] = cell.emptied();
    });
    return new_cells;
  }
};

export class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cells: Model.build_cells(5),
      walkers: [
        new Model.Walker("R01", 1, 0, "R"),
        new Model.Walker("R02", 2, 0, "R"),
      ],
      selection: null,
    };
  }

  move_walker(x, y) {
    if(this.state.selection == null) {
      return;
    }
    if(!this.state.selection.movearea[[x, y]]) {
      this.setState((state) => ({
        selection: null,
      }));

      return;
    }
    this.setState((state) => ({
      walkers: state.walkers.map((walker) => {
        if (walker.name === this.state.selection.walker_name) {
          return walker.moved(x, y);
        } else {
          return walker;
        }
      }),
      selection: null,
    }));
  }

  select_walker(x, y) {
    let walker_name = "";
    this.state.walkers.forEach((walker) => {
      if (walker.x === x && walker.y === y) {
        walker_name = walker.name;
      }
    });

    this.setState((state) => {
      const movearea = Dir.all(x, y).reduce((p, c) => { p[[c.x, c.y]] = 1; return p; }, {});
      return {
        selection: {x: x, y: y, walker_name: walker_name, movearea: movearea},
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
      let walker_props = {};
      let state = "empty";
      if (this.state.selection) {
        if (this.state.selection.movearea[[row.x, row.y]]) {
          state = "movearea";
        }
      }
      const content = this.find_content(row.x, row.y);
      if (content) {
        if (content.type === "walker") {
          walker_props = {
            color: content.content.color,
            state: content.content.state,
            name: content.content.name,
            onClick: () => {
              this.select_walker(row.x, row.y);
            }
          };
        }
      }
      return (
        <Cell key={row.key} x={row.x} y={row.y} state={state} content={walker_props}
              onClick={() => {
                this.move_walker(row.x, row.y);
              }}
        >
          {
            walker_props.color === "R" ?
              <Walker onClick={walker_props.onClick} color={walker_props.color} name={walker_props.name}
                      state={walker_props.state}/> : ""
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
