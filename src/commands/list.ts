const chalk = require('chalk');
import { Command, flags } from '@oclif/command';
import { getPinList } from '../utils';

export default class List extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const pinsFile = getPinList();
    console.log(pinsFile);
    pinsFile
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(pin => {
        console.log(`${chalk.blue(pin.name)} => ${chalk.red(pin.path)}`);
      });
  }
}
