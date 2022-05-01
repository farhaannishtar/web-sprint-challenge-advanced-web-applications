import React from 'react'
import Spinner from "./Spinner";

import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'


// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
test('sanity', () => {
  expect(true).toBe(true)
})

test("Check for spinner after login", () => {
  // login screen
  render(<BrowserRouter><App /></BrowserRouter>)
  const usernameInput = () => screen.queryByPlaceholderText('Enter username')
  const passwordInput = () => screen.queryByPlaceholderText('Enter password')
  const loginBtn = () => screen.queryByText('Submit credentials')

  expect(loginBtn()).toBeDisabled()
  fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
  fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
  expect(loginBtn()).toBeDisabled()
  fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
  fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
  expect(loginBtn()).toBeEnabled()

  fireEvent.click(loginBtn())
  const spinnerMessage = screen.queryByText(/Please wait.../i)
  expect(spinnerMessage);
})


// ✨ implement
