import { Command, flags } from '@oclif/command';
import { getPinList } from '../utils';
const { prompt } = require('enquirer');
const chalk = require('chalk');
const execa = require('execa');

export default class Search extends Command {
  static description = 'Search for a pin';

  static examples = [`$ pin search`];

  async run() {
    try {
      const pinList = getPinList();
      if (!pinList.length) {
        this.log(
          `No pin yet, add your first pin with ${chalk.blue('pin add')}`,
        );
        this.exit();
      }
      const { pin } = await prompt({
        type: 'autocomplete',
        name: 'pin',
        message: 'Search a pin',
        limit: 30,
        choices: pinList.map(pin => `${pin.name} => ${pin.path}`),
      });
      const pinSelectedPath = pin.split(' => ')[1];
      await execa('cd', [pinSelectedPath]);
    } catch (error) {
      console.log(error);
      this.exit();
    }
  }
}
