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

  expect(replaceClassNames(selectors, styles, code)).toMatch(/(glamor-0)/)
  expect(replaceClassNames(selectors, styles, code)).not.toMatch(/(css-12345)/)
})

test('Replaces multiple glamor classes', () => {
  const selectors = ['.css-12345', '.css-67890']
  const styles = `
    .css-12345,
    [data-css-12345] {
      font-size: 1.5em;
      text-align: center;
      color: palevioletred;
    }

    .css-67890,
    [data-css-67890] {
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

  expect(replaceClassNames(selectors, styles, code)).toMatch(/(glamor-0)/)
  expect(replaceClassNames(selectors, styles, code)).toMatch(/(glamor-1)/)
})

test('does not replace non-glamor classes', () => {
  const selectors = ['.p-4em']
  const styles = `
    .p-4em,
    [data-p-4em] {
      padding: 4em;
    }
  `
  const code = `
      <section
        className="p-4em"
      >
        Hello World
      </section>
  `

  expect(replaceClassNames(selectors, styles, code)).not.toMatch(/(glamor-0)/)
  expect(replaceClassNames(selectors, styles, code)).toMatch(/(p-4em)/)
})

test('only replaces classes beginning with "css-"', () => {
  const selectors = ['.not-glamor-css-1234']
  const styles = `
    .not-glamor-css-1234,
    [data-not-glamor-css-1234] {
      padding: 4em;
    }
  `
  const code = `
      <section
        className="not-glamor-css-1234"
      >
        Hello World
      </section>
  `

  expect(replaceClassNames(selectors, styles, code)).not.toMatch(/(glamor-0)/)
  expect(replaceClassNames(selectors, styles, code)).toMatch(
    /(not-glamor-css-1234)/,
  )
})
