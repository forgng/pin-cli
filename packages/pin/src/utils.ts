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

export function pinAlreadyExists(pin: string): boolean {
  const pinsContent = readFile(PINS_FILE);
  return pinsContent.includes(`alias ${pin}="`);
}

export function addPin(name: string) {
  if (pinAlreadyExists(name)) {
    throw new Error('Pin already exists');
  }
  try {
    fs.copyFileSync(PINS_FILE, PINS_FILE_TMP);
    fs.appendFileSync(PINS_FILE, `alias ${name}="cd ${process.cwd()}"`);
  } catch (error) {
    throw new Error('Something went wrong');
  } finally {
    if (checkIfFileExists(PINS_FILE_TMP)) {
      fs.unlinkSync(PINS_FILE_TMP);
    }
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
  return data.toString();
}

interface Pin {
  name: string;
  path: string;
}
export function getPinList(): Pin[] {
  let pinsFileContent = readFile(PINS_FILE);
  console.log(pinsFileContent);
  const pinsList = pinsFileContent
    .replace(/\alias /g, '')
    .replace(/"/g, '')
    .split('\n')
    .filter(line => line)
    .map(line => {
      const lineSplitted = line.split('=');
      return {
        name: lineSplitted[0],
        path: lineSplitted[1],
      };
    });
  console.log(pinsList);
  return pinsList;
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