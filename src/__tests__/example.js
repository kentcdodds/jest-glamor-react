import React from 'react'
import ReactDOM from 'react-dom'
import * as glamor from 'glamor'
import serializer from '../serializer'
import {toHaveStyleRule} from '../matchers'

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

function render(ui) {
  const div = document.createElement('div')
  ReactDOM.render(ui, div)
  return div.children[0]
}

test('react-dom snapshot', () => {
  const node = render(
    <Wrapper>
      <Title>Hello World, this is my first glamor styled component!</Title>
    </Wrapper>,
  )
  expect(node).toMatchSnapshot()
})

test('react-dom toHaveStyleRule', () => {
  const node = render(
    <Wrapper>
      <Title>Hello World, this is my first glamor styled component!</Title>
    </Wrapper>,
  )
  expect(node).toHaveStyleRule('background', 'papayawhip')
})
