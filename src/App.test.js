import React from 'react';
import { shallow } from 'enzyme';
import { App, Board, Cell } from './App';

it('renders without crashing', () => {
  shallow(<App />);
});

describe('Board', () => {
  it('renders', () => {
    shallow(<Board />);
  });

  it('has cells', () => {
    const wrapper = shallow(<Board />);
    expect(wrapper.find(Cell).length).toBe(3 + 4 + 5 + 4 + 3);
  });

});

