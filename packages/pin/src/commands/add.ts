const chalk = require('chalk');

import { Command, flags } from '@oclif/command';
import {
  createPinsFile,
  checkIfFileExists,
  readFile,
  PINS_ALIASES,
  BASH_FILE,
  getPinList,
  pinAlreadyExists,
  addPin,
} from '../utils';
const { prompt } = require('enquirer');

interface InputArgs {
  args: {
    pin: string;
  };
  flags: any;
}

export default class Add extends Command {
  static description = 'Add a new pin';

  // static flags = {
  //   help: flags.help({ char: 'h' }),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({ char: 'n', description: 'name to print' }),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({ char: 'f' }),
  // };

  static args = [
    { name: 'pin', required: false, description: 'Name for the pin' },
  ];

  async run() {
    const { args, flags }: InputArgs = this.parse(Add);
    createPinsFile();
    let pinName;
    if (args.pin) {
      pinName = args.pin;
    } else {
      pinName = await askForPinName();
    }
    if (!pinName) {
      return;
    }
    addPin({ name });
  }
}

async function askForPinName() {
  const { name }: { name: string } = await prompt({
    type: 'input',
    name: 'name',
    message: 'Give this pin a memorable name',
  });
  return name;
}
