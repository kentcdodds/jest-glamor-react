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
  const result = replaceClassNames(selectors, styles, code)
  expect(result).toMatch(/(glamor-0)/)
  expect(result).not.toMatch(/(css-12345)/)
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
  const result = replaceClassNames(selectors, styles, code)
  expect(result).toMatch(/(glamor-0)/)
  expect(result).toMatch(/(glamor-1)/)
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
  const result = replaceClassNames(selectors, styles, code)
  expect(result).not.toMatch(/(glamor-0)/)
  expect(result).toMatch(/(p-4em)/)
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
  const result = replaceClassNames(selectors, styles, code)
  expect(result).not.toMatch(/(glamor-0)/)
  expect(result).toMatch(/(not-glamor-css-1234)/)
})

test('replaces css-nil classes', () => {
  const selectors = ['.css-nil']
  const styles = ``
  const code = `
    <h1
      className="changed-class css-nil"
    >
      Hello World, this is my first glamor styled component!
    </h1>
  `
  const result = replaceClassNames(selectors, styles, code)
  expect(result).toMatch(/(glamor-0)/)
  expect(result).not.toMatch(/(css-nil)/)
})

test('replaces css-label- classes', () => {
  const selectors = ['.css-label-12345']
  const styles = `
    .css-label-12345,
    [data-css-label-12345] {
      font-size: 1.5em;
      text-align: center;
      color: palevioletred;
    }
  `
  const code = `
    <h1
      className="changed-class css-label-12345"
    >
      Hello World, this is my first glamor styled component!
    </h1>
  `
  const result = replaceClassNames(selectors, styles, code)
  expect(result).toMatch(/(glamor-0)/)
  expect(result).not.toMatch(/(css-label-12345)/)
})
