const chalk = require('chalk');
import { Command, flags } from '@oclif/command';
import {
  askForPinName,
  createPinsFileIfNotExists,
  readJson,
  PINS_FILE,
  writeToFile,
  PINS_ALIASES,
  now,
  updatePinList,
  addPin,
  getPinByName,
} from '../utils';
import { PinFile, Pin } from './types';
const { prompt } = require('enquirer');

interface InputArgs {
  args: {
    pin: string;
  };
  flags: {
    force: boolean;
  };
}

export default class Add extends Command {
  static description = 'Add a new pin';

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [
    { name: 'pin', required: false, description: 'Name for the pin' },
  ];

  async run() {
    createPinsFileIfNotExists();
    const { args, flags }: InputArgs = this.parse(Add);
    let pinName: string;
    if (args.pin) {
      pinName = args.pin;
    } else {
      pinName = await askForPinName();
    }
    if (!pinName) {
      return;
    }

    if (flags.force) {
      addPin({ name: pinName, path: process.cwd() });
    } else {
      if (getPinByName(pinName)) {
        this.log(chalk.yellow('A pin with this name already exists'));
        const { overwrite } = await prompt({
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite?',
        });
        if (overwrite === true) {
          addPin({ name: pinName, path: process.cwd() });
        } else {
          let newName = pinName;
          while (getPinByName(newName)) {
            // try {
            newName = await askForPinName('Choose another name');
            // } catch (error) {
            // this.exit();
            // }
          }

          if (!newName) {
            this.exit();
          }
          this.exit();
        }
      } else {
        addPin({ name: pinName, path: process.cwd() });
      }
    }
    this.log(chalk.green('New pin added'));
    this.log(`${pinName} ${chalk.red('=>')} ${process.cwd()}`);
  }
}
