import { Command, flags } from '@oclif/command';
const chalk = require('chalk');
import { prompt } from 'enquirer';

import {
  getPinByPath,
  getPinsThatUsesCurrentPath,
  askForPinName,
  removePins,
} from '../utils';

export default class Delete extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  async run() {
    const { args, flags } = this.parse(Delete);
    const pinUsedByCurrentPath = getPinByPath(process.cwd());
    console.log('pinUsedByCurrentPath', pinUsedByCurrentPath);
    if (!pinUsedByCurrentPath.length) {
      const pinName = await askForPinName();
      console.log(pinName);
    } else {
      this.log(
        `${chalk.red(pinUsedByCurrentPath.length)} pin${
          pinUsedByCurrentPath.length > 1 ? 's' : ''
        } found linked to the current path: ${chalk.red(
          pinUsedByCurrentPath.map(pin => pin.name).join(','),
        )}`,
      );
      const { remove } = await prompt({
        type: 'confirm',
        name: 'remove',
        message: `Do you want do delete ${
          pinUsedByCurrentPath.length > 1 ? 'them' : 'it'
        }?`,
      });
      if (remove) {
        removePins(pinUsedByCurrentPath);
      }
    }
  }
}
