const chalk = require('chalk');
import { Command, flags } from '@oclif/command';
import { addPin, askForPinName, getPinByName } from '../utils';
const { prompt } = require('enquirer');

export default class Add extends Command {
  static description = 'Add new pin';

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'name to print' }),
    force: flags.boolean({ char: 'f' }),
  };

  static args = [
    { name: 'pin', required: false, description: 'Name for the pin' },
  ];

  async run() {
    try {
      const { args, flags } = this.parse(Add);
      let pinName: string;
      if (args.pin || flags.name) {
        pinName = args.pin || flags.name;
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
