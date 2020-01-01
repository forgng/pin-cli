const chalk = require('chalk');
import { Command, flags } from '@oclif/command';
import { getPinList } from '../utils';

export default class List extends Command {
  static description = 'List all the pins';
  static examples = [`$ pin list`];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    const pinsFile = getPinList();
    if (!pinsFile.length) {
      this.log(
        `${chalk.yellow(
          "You don't have any pin. Create a new pin with",
        )} "${chalk.red('pin add')}"`,
      );
    }
    pinsFile
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(pin => {
        this.log(`${chalk.blue(pin.name)} => ${pin.path}`);
      });
  }
}
