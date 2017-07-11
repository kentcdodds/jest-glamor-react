import {replaceClassNames} from './replace-class-names'

test('Replaces a single class', () => {
  const selectors = ['.css-12345']
  const styles = `
    .css-12345,
      [data-css-12345] {
        font-size: 1.5em;
        text-align: center;
        color: palevioletred;
      }
  `
  const code = `
      <h1
        className="changed-class css-12345"
      >
        Hello World, this is my first glamor styled component!
      </h1>
  `

  expect(replaceClassNames(selectors, styles, code)).toMatch(/(c0)/)
  expect(replaceClassNames(selectors, styles, code)).not.toMatch(/(css-12345)/)
})

test('Replaces multiple classes', () => {
  const selectors = ['.css-12345', '.css-67890']
  const styles = `
    .css-12345,
    [data-css-12345] {
      font-size: 1.5em;
      text-align: center;
      color: palevioletred;
    }

    .css-1tnuino,
    [data-css-1tnuino] {
      font-size: 1.5em;
      text-align: center;
      color: palevioletred;
    }
  `
  const code = `
      <section
        className="some-other-class css-12345"
      >
        <h1
          className="changed-class css-67890"
        >
          Hello World, this is my first glamor styled component!
        </h1>
      </section>
  `

  expect(replaceClassNames(selectors, styles, code)).toMatch(/(c0)/)
  expect(replaceClassNames(selectors, styles, code)).toMatch(/(c1)/)
})
