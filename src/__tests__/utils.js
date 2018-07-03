import * as enzyme from 'enzyme'
import renderer from 'react-test-renderer'
import React from 'react'
import {getClassNames, getNodes, getSelectors} from '../utils'

const enzymeMethods = ['shallow', 'mount', 'render']

describe('getClassNames', () => {
  it('handles nothing being passed to it', () => {
    expect(getClassNames()).toEqual([])
  })
  it('handles bad data being passed to it', () => {
    expect(getClassNames({})).toEqual([])
  })
  describe('react-test-renderer', () => {
    it('can grab the className prop', () => {
      const wrapper = renderer.create(<div className="test" />).toJSON()
      expect(getClassNames(wrapper)).toEqual(['test'])
    })
    it('can grab the class prop', () => {
      /* eslint-disable react/no-unknown-property */
      const wrapper = renderer.create(<div class="test" />).toJSON()
      /* eslint-enable react/no-unknown-property */
      expect(getClassNames(wrapper)).toEqual(['test'])
    })
    it('returns an empty string if there is no valid prop', () => {
      const wrapper = renderer.create(<div />).toJSON()
      expect(getClassNames(wrapper)).toEqual([])
    })
  })
  describe('enzyme', () => {
    it('can grab the className prop', () => {
      enzymeMethods.forEach(method => {
        const wrapper = enzyme[method](<div className="test" />)
        expect(getClassNames(wrapper)).toEqual(['test'])
      })
    })
    it('handle subcomponents', () => {
      enzymeMethods.forEach(method => {
        const wrapper = enzyme[method](
          <div className="test1">
            <span className="test2" />
          </div>,
        )
        const subcomponent = wrapper.find('span')
        expect(getClassNames(subcomponent)).toEqual(['test2'])
      })
    })
    it('returns an empty string if there is no valid prop', () => {
      enzymeMethods.forEach(method => {
        const wrapper = enzyme[method](<div />)
        expect(getClassNames(wrapper)).toEqual([])
      })
    })
    it('handles nothing being passed to it', () => {
      expect(getClassNames()).toEqual([])
    })
  })
})

describe('getNodes', () => {
  it('works on enzyme ReactWrappers', () => {
    const wrapper = enzyme.mount(
      <div className="test1">
        <div className="test2" />
      </div>,
    )
    expect(getNodes(wrapper)).toHaveLength(1)
  })
})

describe('getSelectors', () => {
  it('works on enzyme ReactWrappers', () => {
    const wrapper = enzyme.mount(
      <div className="test1">
        <div className="test2" />
      </div>,
    )
    expect(getSelectors(wrapper)).toHaveLength(1)
  })
  it('works when a node has no props (edge case)', () => {
    const wrapper = renderer.create(<div />).toJSON()
    const nodes = getNodes(wrapper)
    // Simulate a node with no props.
    delete nodes[0].props
    expect(getSelectors(nodes)).toHaveLength(0)
  })
})
