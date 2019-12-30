const chalk = require('chalk');

import { Command, flags } from '@oclif/command';
import { addPin, askForPinName } from '../utils';
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
    const { args, flags }: InputArgs = this.parse(Add);
    console.log(args);
    console.log(flags);

    let pinName;
    if (args.pin) {
      pinName = args.pin;
    } else {
      pinName = await askForPinName();
    }
    if (!pinName) {
      return;
    }
    try {
      await addPin({ name: pinName, force: flags.force });
      console.log(chalk.green('New pin added'));
      console.log(`${pinName} ${chalk.red('=>')} ${process.cwd()}`);
    } catch (err) {
      console.log(err);
    }
  }
}
