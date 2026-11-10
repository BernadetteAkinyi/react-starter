import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('renders the task list heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /today's tasks/i }),
    ).toBeInTheDocument()
  })

  it('renders every seed task', () => {
    render(<App />)

    expect(
      screen.getByText(/break the taskflow ui into components/i),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem'))
  })
})
