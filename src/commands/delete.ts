import { Command, flags } from '@oclif/command';
const chalk = require('chalk');
import { prompt } from 'enquirer';

import {
  getPinByPath,
  getPinsThatUsesCurrentPath,
  askForPinName,
  removePins,
  getPinByName,
} from '../utils';

export default class Delete extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
    yes: flags.boolean({ char: 'y' }),
  };

  static args = [
    { name: 'pin', required: false, description: 'pin to delete' },
  ];

  async run() {
    const { args, flags } = this.parse(Delete);

    if (args.pin) {
      const correspondingPin = getPinByName(args.pin);
      if (!correspondingPin) {
        this.log(chalk.red(`There is no pin named ${args.pin}`));
        this.exit();
      }
      removePins([correspondingPin]);
      this.exit();
    }

    const pinUsedByCurrentPath = getPinByPath(process.cwd());
    if (!pinUsedByCurrentPath.length) {
      this.log(`No pins found that points to this directory`);
      this.exit();
    }

    if (flags.yes || flags.force) {
      removePins(pinUsedByCurrentPath);
      this.log(`Pins Removed`);
      this.exit();
    }

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
