// src/Tests/RegisterPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterPage from '../Views/RegisterView';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock window.alert
  });

  afterAll(() => {
    window.alert.mockRestore(); // Restore window.alert after all tests
  });

  it('renders RegisterPage component', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('handles successful registration', () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    const storedUser = JSON.parse(localStorage.getItem('newuser'));
    expect(storedUser).toEqual({ username: 'newuser', password: 'newpassword' });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles duplicate username', () => {
    const mockUser = { username: 'existinguser', password: 'password' };
    localStorage.setItem('existinguser', JSON.stringify(mockUser));

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(window.alert).toHaveBeenCalledWith('Username already exists. Please choose another one.');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles registration error', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Failed to save user data');
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(window.alert).toHaveBeenCalledWith('Failed to register. Please try again.');
    expect(mockNavigate).not.toHaveBeenCalled();

    Storage.prototype.setItem.mockRestore();
  });
});
