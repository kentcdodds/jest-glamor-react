import React from 'react'
import renderer from 'react-test-renderer'
import * as glamor from 'glamor'
import * as enzyme from 'enzyme'
import toJson from 'enzyme-to-json'
import serializer from './serializer'

expect.addSnapshotSerializer(serializer)

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

  expect(tree).toMatchSnapshot()
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
    expect(toJson(tree)).toMatchSnapshot(`enzyme.${method}`)
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

  expect(tree).toMatchSnapshot()
})

test(`doesn't mess up stuff that does't have styles`, () => {
  const tree = renderer.create(<div />).toJSON()

  expect(tree).toMatchSnapshot()
})

test(`doesn't mess up stuff when styles have a child selector`, () => {
  const style = glamor.css({
    '> div': {
      display: 'inline-block',
    },
  })

  const tree = renderer.create(<div><span {...style} /></div>).toJSON()

  expect(tree).toMatchSnapshot()
})

test(`works when css-***** selectors don't have styles`, () => {
  const tree = renderer.create(<div className="css-foo css-bar" />).toJSON()
  expect(tree).toMatchSnapshot()
})

const generalTests = [
  {
    title: 'data attributes',
    styles: {
      backgroundColor: 'rebeccapurple',
      margin: 2,
    },
  },
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
  {
    title: 'supports queries',
    styles: {
      '@supports (display: grid)': {
        display: 'grid',
      },
    },
  },
  {
    title: 'Appended class',
    styles: {
      '&.button': {
        color: 'green',
      },
    },
  },
  {
    title: 'Child selector',
    styles: {
      '> div': {
        display: 'inline-block',
      },
    },
  },
]

generalTests.forEach(({title, styles}, index) => {
  test(title, () => {
    const tree = renderer.create(<div {...glamor.css(styles)} />)
    expect(tree).toMatchSnapshot(
      `${index + 1}. general tests: ${title} - ${JSON.stringify(styles)}`,
    )
  })
})
