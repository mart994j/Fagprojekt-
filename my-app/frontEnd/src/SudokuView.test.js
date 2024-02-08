import { render, screen } from '@testing-library/react';
import SudokuView from './SudokuView';

test('renders learn react link', () => {
  render(<SudokuView />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
