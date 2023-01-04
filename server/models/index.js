// Exports every other js module in the models folder.
// const fs = require("fs");
const User = require("./User");
const Character = require("./Character");
const Quest = require("./Quest");

// I understand what you were doing, but trying to see if I can get the Backend up
// const modelEntries = fs
//   .readdirSync(__dirname)
//   .filter((filename) => /.js$/.test(filename))
//   .map((filename) => [filename.replace(/.js$/, ""), require(`./${filename}`)]);

// module.exports = Object.fromEntries(modelEntries);

module.exports = { Character, Quest, User };