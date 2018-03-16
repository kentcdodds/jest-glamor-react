import React from 'react'
import ReactDOM from 'react-dom'
import * as glamor from 'glamor'
import serializer from '../serializer'

expect.addSnapshotSerializer(serializer)

function Wrapper(props) {
  const className = glamor.css({
    padding: '4em',
    background: 'papayawhip',
  })
  return <section className={`${className}`} {...props} />
}

test('works when the root element does not have styles', () => {
  const div = render(
    <div>
      <Wrapper />
    </div>,
  )

  expect(div).toMatchSnapshot()
})

test(`doesn't mess up stuff that does't have styles`, () => {
  expect(render(<div />)).toMatchSnapshot()
})

test(`doesn't mess up stuff when styles have a child selector`, () => {
  const style = glamor.css({
    '> div': {
      display: 'inline-block',
    },
  })

  const div = render(
    <div>
      <span {...style} />
    </div>,
  )

  expect(div).toMatchSnapshot()
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
    const div = render(<div {...glamor.css(styles)} />)
    expect(div).toMatchSnapshot(
      `${index + 1}. general tests: ${title} - ${JSON.stringify(styles)}`,
    )
  })
})

function render(ui) {
  const div = document.createElement('div')
  ReactDOM.render(ui, div)
  return div.children[0]
}
