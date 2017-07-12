const chalk = require('chalk')
const diff = require('jest-diff')
const stripAnsi = require('strip-ansi')
const {toMatchSnapshot} = require('jest-snapshot')

const isAddition = line => /^\+/.test(line)

const isDeletion = line => /^-/.test(line)

const colorize = message => {
  const messageLines = message.split('\n')

  return messageLines
    .map(line => {
      if (isAddition(line)) {
        return chalk.red(line)
      }
      if (isDeletion(line)) {
        return chalk.green(line)
      }
      return chalk.dim(line)
    })
    .join('\n')
}

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
