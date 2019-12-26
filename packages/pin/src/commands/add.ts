import { Command, flags } from '@oclif/command';
import { PINS_FILE_PATH } from '../config';
const fs = require('fs');
const path = './file.txt';

function _createPinsFile() {
  console.log('PINS_FILE_PATH', PINS_FILE_PATH);
  fs.closeSync(fs.openSync(PINS_FILE_PATH, 'w'));
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

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Add);
    console.log('args', args);
    console.log('flags', flags);
    if (fs.existsSync(PINS_FILE_PATH)) {
      console.log('FILE Exists');
    } else {
      console.log('FILE NOT EXISTS');
      _createPinsFile();
    }
    const name = flags.name || 'world';
    console.log('name', name);
    this.log(`add new pin`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
