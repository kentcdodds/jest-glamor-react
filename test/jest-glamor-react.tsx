import * as React from 'react'
import * as renderer from 'react-test-renderer'
import * as glamor from 'glamor'

import { matcher, serializer } from '../'

expect.addSnapshotSerializer(serializer)
expect.extend(matcher)

export const Wrapper: React.SFC<object> = (props) => {
  const className = glamor.css({
    padding: '4em',
    background: 'papayawhip',
  })

  return <section className={`${className}`} {...props} />
}

export const Title: React.SFC<object> = (props) => {
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
