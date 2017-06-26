import React from 'react'
import renderer from 'react-test-renderer'
import cxs, {sheet} from 'cxs'
import * as enzyme from 'enzyme'
import toJson from 'enzyme-to-json'
import {matcher, serializer} from '../src'

expect.addSnapshotSerializer(serializer(sheet))
expect.extend(matcher)

function Wrapper(props) {
  const className = cxs({
    padding: '4em',
    background: 'papayawhip',
  })
  return <section className={`${className}`} {...props} />
}

function Title(props) {
  const className = cxs({
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

test('works when the root element does not have styles', () => {
  const tree = renderer
    .create(
      <div>
        <Wrapper />
      </div>,
    )
    .toJSON()

  expect(tree).toMatchSnapshotWithGlamor()
})

test(`doesn't mess up stuff that does't have styles`, () => {
  const tree = renderer.create(<div />).toJSON()

  expect(tree).toMatchSnapshotWithGlamor()
})

const generalTests = [
  {
    title: 'media queries',
    styles: {
      fontSize: 24,
      margin: 12,
      '@media (max-width: 641px)': {
        fontSize: 20,
        margin: 10,
      },
    },
  },
  {
    title: 'pseudo elements',
    styles: {
      '& button': {
        color: 'green',
      },
    },
  },
  {
    title: 'pseudo states',
    styles: {
      ':hover': {
        backgroundColor: 'blue',
      },
    },
  },
]

generalTests.forEach(({title, styles}, index) => {
  test(title, () => {
    const tree = renderer.create(<div className={cxs(styles)} />)
    expect(tree).toMatchSnapshotWithGlamor(
      `${index + 1}. general tests: ${title} - ${JSON.stringify(styles)}`,
    )
  })
})
