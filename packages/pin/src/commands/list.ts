import { Command, flags } from '@oclif/command';
import { getPinList } from '../utils';
const { prompt } = require('enquirer');
const chalk = require('chalk');

export default class Hello extends Command {
  static description = 'describe the command here';

  static examples = [`$ pin list`];

  async run() {
    const { args, flags } = this.parse(Hello);
    const pinList = getPinList();
    console.log('pinList', pinList);
    if (!pinList.length) {
      console.log(
        `No pin yet, add your first pin with ${chalk.blue('pin add')}`,
      );
    }
    await prompt({
      type: 'autocomplete',
      name: 'flavor',
      message: 'Search a pin',
      limit: 10,
      choices: pinList.map(pin => `${pin.name} => ${chalk.red(pin.path)}`),
    });
  }
}
