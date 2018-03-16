import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import * as glamor from 'glamor'
import * as enzyme from 'enzyme'
import {toHaveStyleRule} from '../matchers'
import serializer from '../serializer'

expect.addSnapshotSerializer(serializer)
expect.extend({toHaveStyleRule})

function Wrapper(props) {
  const className = glamor.css({
    padding: '4em',
    background: 'papayawhip',
  })
  return <section className={`${className}`} {...props} />
}

function Title(props) {
  const className = glamor.css({
    fontSize: '1.5em',
    textAlign: 'center',
    color: 'palevioletred',
  })
  return <h1 className={`${className}`} {...props} />
}

test('react-test-renderer', () => {
  const wrapper = renderer
    .create(
      <Wrapper>
        <Title>Hello World, this is my first glamor styled component!</Title>
      </Wrapper>,
    )
    .toJSON()

  expect(wrapper).toHaveStyleRule('background', 'papayawhip')
  expect(wrapper).not.toHaveStyleRule('color', 'palevioletred')

  const title = wrapper.children[0]
  expect(title).not.toHaveStyleRule('background', 'papayawhip')
  expect(title).toHaveStyleRule('color', 'palevioletred')
})

test('enzyme', () => {
  const ui = (
    <Wrapper>
      <Title>Hello World, this is my first glamor styled component!</Title>
    </Wrapper>
  )

  const enzymeMethods = ['shallow', 'mount', 'render']
  enzymeMethods.forEach(method => {
    const wrapper = enzyme[method](ui)
    expect(wrapper).toHaveStyleRule('background', 'papayawhip')
    expect(wrapper).not.toHaveStyleRule('color', 'palevioletred')

    const title = method === 'render' ? wrapper.find('h1') : wrapper.find(Title)
    expect(title).not.toHaveStyleRule('background', 'papayawhip')
    expect(title).toHaveStyleRule('color', 'palevioletred')
  })
})

test('dom nodes', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <Wrapper>
      <Title>Hello World, this is my first glamor styled component!</Title>
    </Wrapper>,
    div,
  )
  const wrapper = div.children[0]
  expect(wrapper).toHaveStyleRule('background', 'papayawhip')
  expect(wrapper).not.toHaveStyleRule('color', 'palevioletred')

  const title = wrapper.children[0]
  expect(title).not.toHaveStyleRule('background', 'papayawhip')
  expect(title).toHaveStyleRule('color', 'palevioletred')
})

describe('toHaveStyleRule', () => {
  it('handles bad input', () => {
    const badResult = toHaveStyleRule(null, 'background', null)
    expect(badResult.pass).toBe(false)
    expect(badResult.message()).toBe('Property not found: background')
  })

  it('gives helpful error messages', () => {
    const wrapper = renderer.create(<Wrapper />).toJSON()

    expect(
      toHaveStyleRule(wrapper, 'background', 'palevioletred').message(),
    ).toContain('Expected background to match:')
    expect(
      toHaveStyleRule(wrapper, 'background', 'papayawhip').message(),
    ).toContain('Expected background not to match:')
  })

  it('can recieve string or regex values', () => {
    const wrapper = renderer.create(<Wrapper />).toJSON()

    expect(toHaveStyleRule(wrapper, 'background', /papayawhip/).pass).toBe(true)
    expect(toHaveStyleRule(wrapper, 'background', 'papayawhip').pass).toBe(true)
  })
})
