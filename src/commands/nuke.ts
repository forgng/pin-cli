import { Command, flags } from '@oclif/command';
import { clear } from '../utils';
import { prompt } from 'enquirer';

export default class Nuke extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { nuke } = await prompt({
      type: 'confirm',
      name: 'nuke',
      message: `This will delete everything, and cannot be undone, are you sure?`,
    });
    clear();
  }
}
