import React from 'react';
import {shallow, mount} from 'enzyme';
import {App, Board, Cell, Walker} from './App';

function find_cell(wrapper, x, y) {
  return wrapper.find(Cell).findWhere(n => n.key() === `(${x},${y})`);
}

it('renders without crashing', () => {
  shallow(<App/>);
});

describe('Board', () => {
  describe('appearance', function () {
    it('renders', () => {
      shallow(<Board/>);
    });

    it('has cells', () => {
      const wrapper = shallow(<Board/>);
      expect(wrapper.find(Cell).length).toBe(3 + 4 + 5 + 4 + 3);
      expect(wrapper.find(Cell).map((c) => c.key())).toEqual(
        [
                   "(0,0)", "(1,0)", "(2,0)",
              "(0,1)", "(1,1)", "(2,1)", "(3,1)",
          "(0,2)", "(1,2)", "(2,2)", "(3,2)", "(4,2)",
              "(1,3)", "(2,3)", "(3,3)", "(4,3)",
                  "(2,4)", "(3,4)", "(4,4)",
        ]
      );
    });
  });
});

describe('playing game', () => {
  var wrapper = null;
  beforeEach(() => {
    wrapper = mount(<Board/>);
  });

  function get_walker(idx) {
    return wrapper.find(Walker).at(idx);
  }

  describe('moving walker', function () {
    it('select piece and move', () => {
      expect(wrapper.find(Walker).length).toBe(2);
      const walker = get_walker(0);
      expect(walker.parents(Cell).key()).toBe("(1,0)");
      walker.simulate('click');

      const cell_0_0 = wrapper.find(Cell).findWhere(n => n.key() === "(0,0)");
      cell_0_0.simulate('click');
      const walker_after = get_walker(0);
      expect(walker_after.parents(Cell).key()).toBe("(0,0)");
    });

    it('show move area from (1,0)', () => {
      get_walker(0).simulate('click');

      expect(wrapper.find(Cell).map((c) => c.find('li').hasClass("movearea") ? "o" : "_")).toEqual(
        [
              "o", "_", "o",
            "_", "o", "o", "_",
          "_", "_", "_", "_", "_",
            "_", "_", "_", "_",
              "_", "_", "_"
        ]
      );
    });

    it('show move area from (2,2)', () => {
      get_walker(0).simulate('click');
      find_cell(wrapper, 1, 1).simulate('click');
      get_walker(1).simulate('click');
      find_cell(wrapper, 2, 2).simulate('click');
      get_walker(1).simulate('click');

      expect(wrapper.find(Cell).map((c) => c.find('li').hasClass("movearea") ? "o" : "_")).toEqual(
        [
              "_", "_", "_",
            "_", "o", "o", "_",
          "_", "o", "_", "o", "_",
            "_", "o", "o", "_",
              "_", "_", "_"
        ]
      );
    });
  });
});

