import { hello } from '../index'

describe('hello', () => {
  it('is hello', () => {
    expect(hello).toBe('hello')
    expect(hello).not.toBe('hey')
  })
})
