import { Command, flags } from '@oclif/command';
import { nuke } from '../utils';
import { prompt } from 'enquirer';

export default class Nuke extends Command {
  static description = 'Delete all the pins';

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  async run() {
    const { flags } = this.parse(Nuke);

    if (flags.force) {
      clear();
      this.exit();
    }
    const { nuke } = await prompt({
      type: 'confirm',
      name: 'nuke',
      message: `This will delete all the pins and cannot be undone, are you sure?`,
    });
    if (nuke) {
      nuke();
    }
    this.exit();
  }
}
