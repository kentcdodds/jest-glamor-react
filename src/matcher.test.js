import {toMatchSnapshot} from 'jest-snapshot'
import {toMatchSnapshotWithGlamor} from './matcher'

jest.mock('jest-snapshot', () => ({
  toMatchSnapshot: jest.fn(),
}))

test('passes', () => {
  toMatchSnapshot.mockImplementation(() => ({pass: true}))
  const result = toMatchSnapshotWithGlamor('stuff')
  expect(result).toEqual({pass: true})
})

test('formats a message', () => {
  const expected = `
    .css-1otybxc,
    [data-css-1otybxc] {
      padding: 4em;
      background: papayawhip;
    }

    .css-1tnuino,
    [data-css-1tnuino] {
      font-size: 1.5em;
      text-align: center;
      color: palevioletred;
    }

    <section
      className="some-other-class css-1otybxc"
    >
      <h1
        className="changed-class css-1tnuino"
      >
        Hello World, this is my first glamor styled component!
      </h1>
    </section>
  `
  const actual = `
    .css-i77z7r,
    [data-css-i77z7r] {
      padding: 4em;
      background: blue;
    }

    .css-1252hns,
    [data-css-1252hns] {
      font-size: 1.5em;
      text-align: left;
      color: palevioletred;
    }

    <section
      className="some-other-class css-i77z7r"
    >
      <h1
        className="class-changed css-1252hns"
      >
        Hello World, this is my first glamor styled component!
      </h1>
    </section>
  `
  toMatchSnapshot.mockImplementation(() => ({pass: false, expected, actual}))
  const mockRecieved1 = Symbol('mock-received1')
  const mockRecieved2 = Symbol('mock-received2')
  const result = toMatchSnapshotWithGlamor(mockRecieved1, mockRecieved2)
  expect(toMatchSnapshot).toHaveBeenCalledWith(mockRecieved1, mockRecieved2)
  expect(result.pass).toBe(false)
  expect(result.message).toMatchSnapshot()
})

test('formats a message with data- attributes', () => {
  const expected = `
    .css-12gg9yz,
    [data-css-12gg9yz] {
      background-color: rebeccapurple;
      margin: 2px;
    }

    <div
      data-css-12gg9yz=""
    />
  `

  const actual = `
    .css-1rdlmfe,
    [data-css-1rdlmfe] {
      background-color: rebeccapurples;
      margin: 2px;
    }

    <div
      data-css-1rdlmfe=""
    />
  `
  toMatchSnapshot.mockImplementation(() => ({pass: false, expected, actual}))
  const mockRecieved1 = Symbol('mock-received1')
  const mockRecieved2 = Symbol('mock-received2')
  const result = toMatchSnapshotWithGlamor(mockRecieved1, mockRecieved2)
  expect(toMatchSnapshot).toHaveBeenCalledWith(mockRecieved1, mockRecieved2)
  expect(result.pass).toBe(false)
  expect(result.message).toMatchSnapshot()
})
