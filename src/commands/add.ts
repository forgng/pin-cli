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
import { PinFile, Pin } from '../types';
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
    try {
      createPinsFileIfNotExists();
      const { args, flags }: InputArgs = this.parse(Add);
      let pinName: string;
      if (args.pin) {
        pinName = args.pin;
        while (pinName === 'pin') {
          this.log('Invalid name, choose another name');
          pinName = await askForPinName('Choose another name');
        }
      } else {
        pinName = await askForPinName();
      }
      if (!pinName) {
        this.exit();
      }

      if (flags.force) {
        addPin({ name: pinName, path: process.cwd() });
        this.log(chalk.green('New pin added!'));
        this.exit();
      }
      if (!getPinByName(pinName)) {
        addPin({ name: pinName, path: process.cwd() });
        this.log(chalk.green('New pin added!'));
        this.exit();
      }
      let newName = pinName;
      while (getPinByName(newName)) {
        this.log(chalk.yellow('A pin with this name already exists'));
        const { overwrite } = await prompt({
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite?',
        });
        if (overwrite === true) {
          addPin({ name: pinName, path: process.cwd() });
          this.log(chalk.green('Pin overridden!'));
          this.exit();
        } else {
          while (pinName === 'pin') {
            this.log('Using pin');
            newName = await askForPinName('Choose another name');
          }
        }
      }
      if (!newName) {
        this.exit();
      }
    } catch (error) {
      this.exit();
    }
  }
}
