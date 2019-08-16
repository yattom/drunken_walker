import React from 'react';
import {shallow, mount} from 'enzyme';
import {App, Model, Board, Cell, Walker} from './App';

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

  function get_walker(name) {
    return wrapper.find(Walker).filterWhere((w) => w.props().name === name).at(0);
  }

  describe('moving walker', function () {
    it('select piece and move', () => {
      expect(wrapper.find(Walker).length).toBe(2);
      const walker = get_walker("R01");
      expect(walker.parents(Cell).key()).toBe("(1,0)");
      walker.simulate('click');

      const cell_0_0 = wrapper.find(Cell).findWhere(n => n.key() === "(0,0)");
      cell_0_0.simulate('click');
      const walker_after = get_walker("R01");
      expect(walker_after.parents(Cell).key()).toBe("(0,0)");
    });

    describe('movearea are correct', function () {
      function dump_cell(ofClass) {
        const cells = wrapper.find(Cell).map((c) => c.find('li').hasClass(ofClass) ? "o" : "_");
        expect(cells.length).toEqual(19);
        let dump = [];
        dump[0] = "  " + cells[0] + " " + cells[1] + " " + cells[2] + "  ";
        dump[1] = " " + cells[3] + " " + cells[4] + " " + cells[5] + " " + cells[6] + " ";
        dump[2] = "" + cells[7] + " " + cells[8] + " " + cells[9] + " " + cells[10] + " " + cells[11] + "";
        dump[3] = " " + cells[12] + " " + cells[13] + " " + cells[14] + " " + cells[15] + " ";
        dump[4] = "  " + cells[16] + " " + cells[17] + " " + cells[18] + "  ";
        return dump;
      }

      it('show move area from (1,0)', () => {
        get_walker("R01").simulate('click');

        expect(dump_cell("movearea")).toEqual(
          [
            "  o _ o  ",
            " _ o o _ ",
            "_ _ _ _ _",
            " _ _ _ _ ",
            "  _ _ _  ",
          ]
        );
      });

      it('show move area from (2,2)', () => {
        get_walker("R01").simulate('click');
        find_cell(wrapper, 1, 1).simulate('click');
        get_walker("R01").simulate('click');
        find_cell(wrapper, 2, 2).simulate('click');
        get_walker("R01").simulate('click');

        expect(dump_cell("movearea")).toEqual(
          [
            "  _ _ _  ",
            " _ o o _ ",
            "_ o _ o _",
            " _ o o _ ",
            "  _ _ _  ",
          ]
        );
      });
    });

    describe('selecting walker for moving', function () {

      it('clicking an empty cell does not select a walker', () => {
        find_cell(wrapper, 3, 3).simulate('click');
        expect(wrapper.find(Cell).filterWhere((c) => c.find('li').hasClass("movearea")).length).toEqual(0);
      });

      it('clicking an walker does select a walker', () => {
        get_walker("R01").simulate('click');
        expect(wrapper.find(Cell).filterWhere((c) => c.find('li').hasClass("movearea")).length).toBeGreaterThan(0);
      });

      it('after selecting a walker, clicking an cell unselects the walker', () => {
        const pos = get_walker("R01").parents(Cell).key();
        get_walker("R01").simulate('click');
        find_cell(wrapper, 3, 3).simulate('click');
        expect(get_walker("R01").parents(Cell).key()).toBe(pos);
        expect(wrapper.find(Cell).filterWhere((c) => c.find('li').hasClass("movearea")).length).toEqual(0);
      });

    });

    describe('uncertainty based scenario tests', function () {
      it('select a walker, unselect it, select another walker then move', () => {
        expect(get_walker("R01").parents(Cell).key()).toBe("(1,0)");
        expect(get_walker("R02").parents(Cell).key()).toBe("(2,0)");
        get_walker("R01").simulate('click');
        find_cell(wrapper, 3, 3).simulate('click');
        get_walker("R02").simulate('click');
        find_cell(wrapper, 3, 1).simulate('click');
        expect(get_walker("R01").parents(Cell).key()).toBe("(1,0)");
        expect(get_walker("R02").parents(Cell).key()).toBe("(3,1)");
      });

    });
  });

});


describe('Model', function() {
  it('Model.Walker is immutable', function() {
    const sut = new Model.Walker("dummy", 0, 0);
    expect(() => {sut.x = -1;}).toThrow();
  });
  it('Model.Cell is immutable', function() {
    const sut = new Model.Cell("key", 0, 0, "empty");
    expect(() => {sut.x = -1;}).toThrow();
  });
});
