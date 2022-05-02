import React from 'react'
import Spinner from "./Spinner";

import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'


// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
test('sanity', () => {
  expect(true).toBe(true)
})

test("Check for spinner after on prop is passed", () => {
  // login screen
  const { rerender } = render(
    <Spinner on={false}/>
  );

  let spinnerMessage = screen.queryByText(/Please wait.../i)
  expect(spinnerMessage).not.toBeInTheDocument();

  rerender(<Spinner on={true}/>)
  spinnerMessage = screen.queryByText(/Please wait.../i)
  expect(spinnerMessage).toBeInTheDocument();

})


// ✨ implement
