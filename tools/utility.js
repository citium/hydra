var chalk = require("chalk")
var stringifyObject = require("stringify-object")

var maxLength = 0;
var systemIndex = 0;
var colors = [
  "red",
  "green",
  "yellow",
  // "blue",
  "magenta",
  "cyan",
// "white",
// "gray"
]
var currentIndex = 0;
var line = undefined;

function titleLog(title) {
  let index = ++systemIndex
  let color = chalk.bold[colors[index % colors.length]]
  let length = title.length
  maxLength = Math.max(maxLength, length)
  return function(message) {
    let string = message + "";
    if (currentIndex != index) {
      if (line) {
        console.log(line);
      }
      line = color("-".repeat(maxLength + 3));
      currentIndex = index;
    }
    let space = " ".repeat(maxLength - length)
    let header = color(` ${title} ${space}| `);
    console.log(header + string.replace(/\n/g, "\n" + header))
  }
}

function reporter(log) {
  return (stats) => {
    const options = {
      hash: false,
      version: false,
      timings: true,
      assets: true,
      chunks: false,
      modules: true,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: false,
      warnings: true,
      publicPath: false,
      colors: true
    };
    const filter = v => v.indexOf('[not cacheable]') === -1
    const message = stats
      .toString(options)
      .split("\n")
      .filter(filter)
      .join("\n");
    log(message);
  }
}

function getStats(statsResult) {
  var stats = statsResult.toJson({
    source: false
  })
  var error = !stats.errors.length
  return error ? stats : error
}

function pretty(obj) {
  return stringifyObject(obj, {
    indent: '  ',
    singleQuotes: false,
    inlineCharacterLimit: 80
  })
}

module.exports = {
  titleLog,
  reporter,
  getStats,
  pretty
}
