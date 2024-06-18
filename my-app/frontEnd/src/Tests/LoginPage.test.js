// src/Tests/LoginPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginPage from '../Views/LoginPage';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock useUser from UserContext
jest.mock('../UserContext', () => ({
  useUser: jest.fn().mockReturnValue({
    setUsername: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  const mockNavigate = jest.fn();
  const mockSetUsername = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useUser.mockReturnValue({
      setUsername: mockSetUsername,
    });
    localStorage.clear();
  });

  it('renders LoginPage component', () => {
    render(<LoginPage />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Not a user?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('handles successful login', () => {
    const mockUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    localStorage.setItem('testuser', JSON.stringify(mockUser));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockSetUsername).toHaveBeenCalledWith('testuser');
    expect(mockNavigate).toHaveBeenCalledWith('/menu');
    expect(screen.queryByText('Incorrect password')).not.toBeInTheDocument();
    expect(screen.queryByText('Username not registered')).not.toBeInTheDocument();
  });

  it('handles incorrect password', () => {
    const mockUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    localStorage.setItem('testuser', JSON.stringify(mockUser));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByText('Incorrect password')).toBeInTheDocument();
    expect(mockSetUsername).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles unregistered username', () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'unknownuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByText('Username not registered')).toBeInTheDocument();
    expect(mockSetUsername).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to register page when "Register here" is clicked', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText('Register here'));

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
