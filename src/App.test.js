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
    });
  });

  describe('moving walker', function () {
    it('select piece', () => {
      const wrapper = mount(<Board/>);
      expect(wrapper.find(Walker).length).toBe(2);
      const walker = wrapper.find(Walker).at(0);
      expect(walker.parents(Cell).key()).toBe("(1,0)");
      walker.simulate('click');

      const cell_1_1 = wrapper.find(Cell).findWhere(n => n.key() === "(0,0)");
      cell_1_1.simulate('click');
      const walker_after = wrapper.find(Walker).at(0);
      expect(walker_after.parents(Cell).key()).toBe("(0,0)");
    });
  });
});

