import React from 'react';
import { render } from 'react-testing-library';
import { App, Board } from './App';

it('renders without crashing', () => {
  render(<App />);
});

describe('Board', () => {
  it('renders', () => {
    render(<Board />);
  });

  it('has cells', () => {
    const { getAllByTestId } = render(<Board />);
    expect(getAllByTestId(/^cell_/).length).toBe(3 + 4 + 5 + 4 + 3);
  });

});

