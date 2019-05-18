import React from 'react';
import { shallow, mount } from 'enzyme';
import {App, Board, Cell, Walker } from './App';

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
  describe('moving walker', function () {
    it('select piece and move', () => {
      const wrapper = mount(<Board/>);
      expect(wrapper.find(Walker).length).toBe(2);
      const walker = wrapper.find(Walker).at(0);
      expect(walker.parents(Cell).key()).toBe("(1,0)");
      walker.simulate('click');

      const cell_0_0 = wrapper.find(Cell).findWhere(n => n.key() === "(0,0)");
      cell_0_0.simulate('click');
      const walker_after = wrapper.find(Walker).at(0);
      expect(walker_after.parents(Cell).key()).toBe("(0,0)");
    });
  });
});

