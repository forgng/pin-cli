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
      nuke();
      this.log('All pins have been deleted');
      this.exit();
    }
    const { confirm } = await prompt({
      type: 'confirm',
      name: 'confirm',
      message: `This will delete all the pins and cannot be undone, are you sure?`,
    });
    if (confirm) {
      nuke();
      this.log('All pins have been deleted');
    }
    this.exit();
  }
}
