# jest-glamor-react

Jest utilities for Glamor and React

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

<a href="https://app.codesponsor.io/link/PKGFLnhDiFvsUA5P4kAXfiPs/kentcdodds/jest-glamor-react" rel="nofollow"><img src="https://app.codesponsor.io/embed/PKGFLnhDiFvsUA5P4kAXfiPs/kentcdodds/jest-glamor-react.svg" style="width: 888px; height: 68px;" alt="Sponsor" /></a>

## The problem

If you use [`glamor`][glamor] as your CSS-in-JS solution, and you use
[snapshot testing][snapshot] with [jest][jest] then you probably have some test
snapshots that look like:

```html
<h1
  class="css-1tnuino"
>
  Hello World
</h1>
```

And that's not super helpful from a styling perspective. Especially when there
are changes to the class, you can see that it changed, but you have to look
through the code to know _what_ caused the class name to change.

## This solution

This allows your snapshots to look more like:

```html
.css-1tnuino,
[data-css-1tnuino] {
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
}

<h1
  class="css-1tnuino"
>
  Hello World
</h1>
```

This is much more helpful because now you can see the CSS applied and over time
it becomes even more helpful to see how that changes over time.

This builds on the work from [@MicheleBertoli][MicheleBertoli] in
[`jest-styled-components`][jest-styled-components] to bring a similar experience
to React projects that use [`glamor`][glamor].

### Preview

<img
  src="https://github.com/kentcdodds/jest-glamor-react/raw/master/other/screenshot.png"
  alt="Terminal Screenshot"
  title="Terminal Screenshot"
  width="500px"
/>

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev jest-glamor-react
```

## Usage

At the top of your test file:

```javascript
import serializer from 'jest-glamor-react'

expect.addSnapshotSerializer(serializer)
```

Or in your Jest serializer config:

```javascript
{
  "snapshotSerializers": [
    "jest-glamor-react"
  ]
}
```

If you have set jest.config variable `"testEnvironment": "node"`, you will need to manually mock up browser gloabl objects so it is recommended to use `"testEnvironment": "jsdom"` instead.

Here are some components:

```javascript
import React from 'react'
import * as glamor from 'glamor'

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
```

And here's how we'd test them with `react-test-renderer`:

```javascript
import React from 'react'
import renderer from 'react-test-renderer'

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
```

Works with enzyme too:

```javascript
import * as enzyme from 'enzyme'
import toJson from 'enzyme-to-json'

test('enzyme', () => {
  const ui = (
    <Wrapper>
      <Title>Hello World, this is my first glamor styled component!</Title>
    </Wrapper>
  )

  expect(toJson(enzyme.shallow(ui))).toMatchSnapshot(`enzyme.shallow`)
  expect(toJson(enzyme.mount(ui))).toMatchSnapshot(`enzyme.mount`)
  expect(toJson(enzyme.render(ui))).toMatchSnapshot(`enzyme.render`)
})
```

If you use a library with a similar stylesheet solution to [`glamor`][glamor] like [`cxs`][cxs] you can do this instead:

```javascript
import {sheet} from 'cxs'
import serializer from 'jest-glamor-react'

expect.addSnapshotSerializer(serializer(sheet))
```

Then you can create components like this:

```javascript
import React from 'react'
import cxs from 'cxs'

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
```

And test them the same way as before.


## Inspiration

As mentioned earlier, [@MicheleBertoli][MicheleBertoli]'s
[`jest-styled-components`][jest-styled-components] was a huge inspiration for
this project. And much of the original code came from from that MIT Licensed
project. Thank you so much Michele! 👏

## Other Solutions

I'm unaware of other solutions. Please file a PR if you know of any!

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/1308971?v=3" width="100px;"/><br /><sub>Michele Bertoli</sub>](http://michele.berto.li)<br />[💻](https://github.com/kentcdodds/jest-glamor-react/commits?author=MicheleBertoli "Code") [📖](https://github.com/kentcdodds/jest-glamor-react/commits?author=MicheleBertoli "Documentation") [⚠️](https://github.com/kentcdodds/jest-glamor-react/commits?author=MicheleBertoli "Tests") | [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/jest-glamor-react/commits?author=kentcdodds "Code") [📖](https://github.com/kentcdodds/jest-glamor-react/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/kentcdodds/jest-glamor-react/commits?author=kentcdodds "Tests") | [<img src="https://avatars2.githubusercontent.com/u/11481355?v=3" width="100px;"/><br /><sub>Mitchell Hamilton</sub>](https://hamil.town)<br />[💻](https://github.com/kentcdodds/jest-glamor-react/commits?author=mitchellhamilton "Code") [📖](https://github.com/kentcdodds/jest-glamor-react/commits?author=mitchellhamilton "Documentation") [⚠️](https://github.com/kentcdodds/jest-glamor-react/commits?author=mitchellhamilton "Tests") | [<img src="https://avatars2.githubusercontent.com/u/11878516?v=3" width="100px;"/><br /><sub>jhurley23</sub>](https://github.com/jhurley23)<br />[💻](https://github.com/kentcdodds/jest-glamor-react/commits?author=jhurley23 "Code") [⚠️](https://github.com/kentcdodds/jest-glamor-react/commits?author=jhurley23 "Tests") [📖](https://github.com/kentcdodds/jest-glamor-react/commits?author=jhurley23 "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/27758243?v=4" width="100px;"/><br /><sub>Gaurav Talwar</sub>](https://github.com/megaurav2002)<br /> |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/jest-glamor-react.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/jest-glamor-react
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/jest-glamor-react.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/jest-glamor-react
[dependencyci-badge]: https://dependencyci.com/github/kentcdodds/jest-glamor-react/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/kentcdodds/jest-glamor-react
[version-badge]: https://img.shields.io/npm/v/jest-glamor-react.svg?style=flat-square
[package]: https://www.npmjs.com/package/jest-glamor-react
[downloads-badge]: https://img.shields.io/npm/dm/jest-glamor-react.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=jest-glamor-react&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/jest-glamor-react.svg?style=flat-square
[license]: https://github.com/kentcdodds/jest-glamor-react/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/jest-glamor-react/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/kentcdodds/jest-glamor-react/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/kentcdodds/jest-glamor-react/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/jest-glamor-react.svg?style=social
[github-watch]: https://github.com/kentcdodds/jest-glamor-react/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/jest-glamor-react.svg?style=social
[github-star]: https://github.com/kentcdodds/jest-glamor-react/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20jest-glamor-react!%20https://github.com/kentcdodds/jest-glamor-react%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/jest-glamor-react.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[glamor]: https://www.npmjs.com/package/glamor
[snapshot]: http://facebook.github.io/jest/docs/snapshot-testing.html
[jest]: http://facebook.github.io/jest/
[MicheleBertoli]: https://github.com/MicheleBertoli
[jest-styled-components]: https://github.com/styled-components/jest-styled-components
[cxs]: https://www.npmjs.com/package/cxs
