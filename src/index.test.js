import React from 'react'
import renderer from 'react-test-renderer'
import * as glamor from 'glamor'
import * as enzyme from 'enzyme'
import toJson from 'enzyme-to-json'
import {matcher, serializer} from '../src'

expect.addSnapshotSerializer(serializer)
expect.extend(matcher)

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
  const tree = renderer
    .create(
      <Wrapper>
        <Title>Hello World, this is my first glamor styled component!</Title>
      </Wrapper>,
    )
    .toJSON()

  expect(tree).toMatchSnapshotWithGlamor()
})

test('enzyme', () => {
  const ui = (
    <Wrapper>
      <Title>Hello World, this is my first glamor styled component!</Title>
    </Wrapper>
  )

  const enzymeMethods = ['shallow', 'mount', 'render']
  enzymeMethods.forEach(method => {
    const tree = enzyme[method](ui)
    expect(toJson(tree)).toMatchSnapshotWithGlamor(`enzyme.${method}`)
  })
})
