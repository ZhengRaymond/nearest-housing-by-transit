import chalk from 'chalk';
const TYPE_OBJECT = 1;
const chalker = (msg, chalker, type) => {
  if (type === TYPE_OBJECT) return console.error(chalker(JSON.stringify(msg)));
  return console.error(chalker(msg));
}
const error = (msg, type = 0) => chalker(msg, chalk.bold.red, type);
const warning = (msg, type = 0) => chalker(msg, chalk.bold.yellow, type);
const success = (msg, type = 0) => chalker(msg, chalk.bold.green, type);
const info = (msg, type = 0) => chalker(msg, chalk.bold.cyan, type);

export const logger = {
  error, warning, success, info
};
