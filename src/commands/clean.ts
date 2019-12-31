import { Command, flags } from '@oclif/command';
import { prompt } from 'enquirer';
import { getPinList, checkIfPathExists, updatePinList } from '../utils';
const chalk = require('chalk');

export default class Clean extends Command {
  static description = 'describe the command here';

  async run() {
    const pinList = getPinList();
    const invalidPins = pinList.filter(pin => !checkIfPathExists(pin.path));
    if (!invalidPins.length) {
      this.log('There are no invalid pins');
      this.exit();
    }
    this.log(
      `There are ${chalk.red(
        invalidPins.length,
      )} invalid pins: ${invalidPins.map(pin => pin.name).join(', ')}`,
    );
    const { remove } = await prompt({
      type: 'confirm',
      name: 'remove',
      message: 'Do you want do delete them?',
    });
    if (remove) {
      const newPins = pinList.filter(pin => checkIfPathExists(pin.path));
      updatePinList(newPins);
    }
  }
}
