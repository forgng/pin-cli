import { Command, flags } from '@oclif/command';
import { pinList } from '../utils';

export default class Hello extends Command {
  static description = 'describe the command here';

  static examples = [`$ pin list`];

  async run() {
    const { args, flags } = this.parse(Hello);
    pinList();
  }
}
