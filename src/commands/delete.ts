import { Command, flags } from '@oclif/command';
import { prompt } from 'enquirer';
import { getPinByName, getPinByPath, removePins } from '../utils';
const chalk = require('chalk');

export default class Delete extends Command {
  static description =
    'Delete a specific pin or the pin associated with the current path';

  static examples = [`$ pin delete [NAME]`];

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'name of the pin to delete' }),
    force: flags.boolean({ char: 'f', description: 'force the delete' }),
  };

  static args = [
    { name: 'pin', required: false, description: 'name of the pin to delete' },
  ];

  async run() {
    const { args, flags } = this.parse(Delete);

    if (args.pin || flags.name) {
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

    if (flags.force) {
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
