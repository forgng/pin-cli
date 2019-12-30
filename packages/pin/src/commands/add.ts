const chalk = require('chalk');

import { Command, flags } from '@oclif/command';
import {
  addPin,
  askForPinName,
  createPinsFile,
  readJson,
  PINS_FILE,
  now,
  writeToFile,
  PINS_ALIASES,
} from '../utils';
import { PinFile } from './types';
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
      createPinsFile();

      let pinsFile = readJson<PinFile>(PINS_FILE);
      console.log('pinsFile', pinsFile);
      let newPins;
      if (flags.force) {
        newPins = [
          ...pinsFile.pins.filter(pin => pin.name !== name),
          { name, path: process.cwd() },
        ];
      } else {
        if (pinsFile.pins.find(pin => pin.name === name)) {
          this.log(chalk.blue('A pin with this name already exists'));
          const { overwrite } = await prompt({
            type: 'confirm',
            name: 'overwrite',
            message: 'Overwrite?',
          });
          console.log('answer', overwrite);
          if (overwrite === true) {
            addPin({ name, force: true });
            return;
          } else {
            console.log('NOT OVERWRITE');
            let newName;
            try {
              newName = await askForPinName('Choose another name');
            } catch (error) {}
            if (!newName) {
              return;
            }
            addPin({ name: newName });
            return;
          }
        } else {
          newPins = [...pinsFile.pins, { name, path: process.cwd() }];
        }
      }
      console.log(newPins);

      const newPinsFile: PinFile = {
        ...pinsFile,
        updatedAt: now(),
        pins: newPins,
      };
      console.log(newPinsFile);
      const pinsAliases = newPins
        .map(pin => `alias ${pin.name}="cd ${pin.path}"\n`)
        .join('');
      console.log('pinsAliases', pinsAliases);
      writeToFile(PINS_FILE, JSON.stringify(newPinsFile));
      writeToFile(PINS_ALIASES, pinsAliases);

      this.log(chalk.green('New pin added'));
      this.log(`${pinName} ${chalk.red('=>')} ${process.cwd()}`);
    } catch (err) {
      this.log(err);
    }
  }
}
