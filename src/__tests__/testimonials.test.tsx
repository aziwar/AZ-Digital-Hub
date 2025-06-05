import React from 'react'
import { render } from '@testing-library/react'
import Testimonials from '../components/sections/Testimonials'
import data from '../data/testimonials.json'

test('renders all testimonials', () => {
  const { getAllByRole } = render(<Testimonials />)
  const items = getAllByRole('heading', { level: 3 })
  expect(items.length).toBe(data.length)
})
