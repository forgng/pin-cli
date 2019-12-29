const fs = require('fs');
import * as path from 'path';
import * as os from 'os';

// # Setting PATH for Python 3.7
// # The original version is saved in .bash_profile.pysave
// PATH="/Library/Frameworks/Python.framework/Versions/3.7/bin:${PATH}"
// eval "$(rbenv init -)"

export const BASH_FILE = path.join(os.homedir(), '.bashrc');
export const PINS_FILE = path.join(os.homedir(), '.pins');
export const BASH_FILE_BACKUP = path.join(os.homedir(), '.bashrc.saved_by_pin');

const tmpDir = '/tmp/';
export const BASH_FILE_TMP = `${tmpDir}.bashrc.tmp`;
export const PINS_FILE_TMP = `${tmpDir}.pins.tmp`;
export const BASH_FILE_BACKUP_TMP = `${tmpDir}.bashrc.saved_by_pin.tpm`;

export function createPinsFile() {
  clear();
  //backup bashrc file
  fs.copyFileSync(BASH_FILE, BASH_FILE_BACKUP);
  // create pins file
  fs.writeFileSync(PINS_FILE, 'alias pin="pin"');
  try {
    let bashContent = readFile(BASH_FILE);
    bashContent = bashContent.replace(/(#pins.*)/g, '');
    bashContent = bashContent.replace(/\. \~\/\.pins/g, '');
    bashContent = bashContent + `\n#pins`;
    bashContent = bashContent + `\n. ~/.pins`;
    fs.writeFileSync(BASH_FILE, bashContent);
  } catch (err) {
    console.log(err);
  }
}

export function clear() {
  try {
    if (checkIfFileExists(PINS_FILE)) {
      fs.unlinkSync(PINS_FILE);
    }
    if (checkIfFileExists(BASH_FILE_BACKUP)) {
      fs.unlinkSync(BASH_FILE_BACKUP);
    }
    copyFile(BASH_FILE, BASH_FILE_TMP);
    let bashContent = readFile(BASH_FILE);
    bashContent = bashContent.replace(/(#pins.*)/g, '');
    bashContent = bashContent.replace(/\. \~\/\.pins/g, '');
    console.log('bashContent', bashContent);
    fs.writeFileSync(BASH_FILE, bashContent);

    if (checkIfFileExists(PINS_FILE_TMP)) {
      fs.unlinkSync(PINS_FILE_TMP);
    }
    if (checkIfFileExists(BASH_FILE_BACKUP_TMP)) {
      fs.unlinkSync(BASH_FILE_BACKUP_TMP);
    }
    if (checkIfFileExists(BASH_FILE_TMP)) {
      fs.unlinkSync(BASH_FILE_TMP);
    }
  } catch (err) {
    console.log(err);
    throw new Error('Somethig went wrong');
  }
}

export function readFile(fileName: string): string {
  const data = fs.readFileSync(fileName, 'utf8');
  console.log(data.toString());
  return data.toString();
}

export const checkIfFileExists = (path: string): boolean => fs.existsSync(path);
export const copyFile = (from: string, to: string) => fs.copyFileSync(from, to);

// export LC_ALL=en_US.UTF-8
// export LANG=en_US.UTF-8
// . ~/.aliases
// export NVM_DIR="/Users/gianlucachiap/.nvm"
// [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

// export PATH="$HOME/.yarn/bin:$PATH"

// export ANDROID_HOME=$HOME/Library/Android/sdk
// export PATH=$PATH:$ANDROID_HOME/emulator
// export PATH=$PATH:$ANDROID_HOME/tools
// export PATH=$PATH:$ANDROID_HOME/tools/bin
// export PATH=$PATH:$ANDROID_HOME/platform-tools
