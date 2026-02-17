import { render, screen } from '@testing-library/react';
import App from './App';

test('renders backbone header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Backbone/i);
  expect(headerElement).toBeInTheDocument();
});
