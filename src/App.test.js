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
});

