import React from 'react'
import { render } from '@testing-library/react'
import Hero from '../components/sections/Hero'

test('Hero renders consistently', () => {
  const { container } = render(<Hero />)
  expect(container.firstChild).toMatchSnapshot()
})
