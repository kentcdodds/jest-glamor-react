const chalk = require('chalk')
const diff = require('jest-diff')
const stripAnsi = require('strip-ansi')
const {toMatchSnapshot} = require('jest-snapshot')

const isAddition = line => /^\+/.test(line)

const isDeletion = line => /^-/.test(line)

const isClassNameAttribute = line => /class(Name)?="css-.*"/.test(line)
const isDataAttribute = line => /data-css-.*/.test(line)
const isClassNameSelector = line => /\.css-.*,/.test(line)
const isDataSelector = line => /\[data-css-.*\] {/.test(line)

const isClassName = line =>
  (isAddition(line) || isDeletion(line)) &&
  (isClassNameAttribute(line) ||
    isDataAttribute(line) ||
    isClassNameSelector(line) ||
    isDataSelector(line))

const colorize = message =>
  message
    .split('\n')
    .map(line => {
      if (isClassName(line)) {
        return chalk.white(line)
      }
      if (isAddition(line)) {
        return chalk.red(line)
      }
      if (isDeletion(line)) {
        return chalk.green(line)
      }
      return chalk.dim(line)
    })
    .join('\n')

const matcher = {
  toMatchSnapshotWithGlamor(...args) {
    const result = toMatchSnapshot.apply(this, args)
    let message

    if (!result.pass) {
      message = diff(result.expected, result.actual, {
        aAnnotation: 'Snapshot',
        bAnnotation: 'Received',
      })
      message = stripAnsi(message)
      message = colorize(message)
    }

    return {pass: result.pass, message}
  },
}

module.exports = matcher
