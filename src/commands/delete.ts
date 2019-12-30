import { Command, flags } from '@oclif/command';
import { isCurrentPathUsedByAPin, getPinsThatUsesCurrentPath } from '../utils';

export default class Delete extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  async run() {
    const { args, flags } = this.parse(Delete);
    const pinsThatUsesCurrentPath = getPinsThatUsesCurrentPath();
    // this.log(pinsThatUsesCurrentPath)

    // if (isCurrentPathUsedByAPin()) {

    // }
  }
}
