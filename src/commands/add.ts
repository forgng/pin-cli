const chalk = require('chalk');
import { Command, flags } from '@oclif/command';
import {
  askForPinName,
  createPinsFile,
  readJson,
  PINS_FILE,
  writeToFile,
  PINS_ALIASES,
  now,
  updatePinList,
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
    try {
      createPinsFile();
      let pinsFile = readJson<PinFile>(PINS_FILE);
      let newPins: Pin[] = [];
      if (flags.force) {
        newPins = [
          ...pinsFile.pins.filter(pin => pin.name !== pinName),
          { name: pinName, path: process.cwd() },
        ];
      } else {
        if (pinsFile.pins.find(pin => pin.name === pinName)) {
          this.log(chalk.yellow('A pin with this name already exists'));
          const { overwrite } = await prompt({
            type: 'confirm',
            name: 'overwrite',
            message: 'Overwrite?',
          });
          if (overwrite === true) {
            newPins = [
              ...pinsFile.pins.filter(pin => pin.name !== pinName),
              { name: pinName, path: process.cwd() },
            ];
          } else {
            console.log('NOT OVERWRITE');
            let newName;
            try {
              newName = await askForPinName('Choose another name');
            } catch (error) {}
            if (!newName) {
              return;
            }
            return;
          }
        } else {
          newPins = [...pinsFile.pins, { name: pinName, path: process.cwd() }];
        }
      }
      updatePinList(newPins);
      // const newPinsFile: PinFile = {
      //   ...pinsFile,
      //   updatedAt: now(),
      //   pins: newPins,
      // };
      // const pinsAliases = newPins
      //   .map(pin => `alias ${pin.name}="cd ${pin.path}"\n`)
      //   .join('');
      // console.log('pinsAliases', pinsAliases);
      // writeToFile(PINS_FILE, JSON.stringify(newPinsFile));
      // writeToFile(PINS_ALIASES, pinsAliases);
      this.log(chalk.green('New pin added'));
      this.log(`${pinName} ${chalk.red('=>')} ${process.cwd()}`);
    } catch (err) {
      this.log(err);
    }
  }
}
