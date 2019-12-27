const fs = require('fs');
import * as path from 'path';
import * as os from 'os';

// # Setting PATH for Python 3.7
// # The original version is saved in .bash_profile.pysave
// PATH="/Library/Frameworks/Python.framework/Versions/3.7/bin:${PATH}"
// eval "$(rbenv init -)"

const FILE_TO_ADD_PINS = path.join(os.homedir(), '.bashrc');
const PINS_FILE_PATH = path.join(os.homedir(), '.pins');
const BASHRC_BACKUP_FILE_PATH = path.join(os.homedir(), '.bashrc.saved_by_pin');
// const PINS_ALIASES_FILE = path.join(os.homedir(), '.pins');

export function createPinsFile() {
  removePinsFile();
  const now = new Date().getTime();
  fs.writeFileSync(
    PINS_FILE_PATH,
    JSON.stringify({ createdAt: now, updatedAt: now }),
  );
  fs.copyFileSync(FILE_TO_ADD_PINS, BASHRC_BACKUP_FILE_PATH);
}

export function removePinsFile() {
  fs.unlinkSync(PINS_FILE_PATH);
}

export function readPinsFile(): string {
  const data = JSON.parse(fs.readFileSync(PINS_FILE_PATH, 'utf8'));
  console.log(data);
  return data;
}

export const checkPinsFileExists = () => fs.existsSync(PINS_FILE_PATH);
