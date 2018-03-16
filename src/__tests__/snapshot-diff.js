import React from 'react'
import ReactDOM from 'react-dom'
import {Simulate} from 'react-dom/test-utils'
import * as glamor from 'glamor'
import {toMatchDiffSnapshot, getSnapshotDiffSerializer} from 'snapshot-diff'
import serializer, {fromHTMLString, fromDOMNode} from '../serializer'

expect.addSnapshotSerializer(getSnapshotDiffSerializer())
expect.addSnapshotSerializer(serializer)
expect.extend({toMatchDiffSnapshot})

function Button({count, ...props}) {
  const className = glamor.css({margin: 10 + count})
  return <button className={`${className}`} {...props} />
}

class Counter extends React.Component {
  state = {count: 0}
  increment = () => {
    this.setState(({count}) => ({count: count + 1}))
  }
  render() {
    const {count} = this.state
    return (
      <Button onClick={this.increment} count={count}>
        {count}
      </Button>
    )
  }
}

test('snapshot diff works', () => {
  const control = render(<Counter />)
  const variable = render(<Counter />)
  Simulate.click(variable)
  // normally I'd probably just use fromDOMNode for both of these
  // but I'm using fromHTMLString to make sure that it works.
  expect(fromHTMLString(control.outerHTML)).toMatchDiffSnapshot(
    fromDOMNode(variable),
  )
})

function render(ui) {
  const div = document.createElement('div')
  ReactDOM.render(ui, div)
  return div.children[0]
}

/* eslint react/prop-types:0 */
