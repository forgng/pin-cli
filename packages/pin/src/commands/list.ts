import { Command, flags } from '@oclif/command';
import { readFile } from '../utils';

export default class Hello extends Command {
  static description = 'describe the command here';

  static examples = [`$ pin list`];

  async run() {
    const { args, flags } = this.parse(Hello);
    const res = readFile();
    console.log('res', res);
  }
}
