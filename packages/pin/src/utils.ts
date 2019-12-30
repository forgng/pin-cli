const fs = require('fs');
const chalk = require('chalk');
import { prompt } from 'enquirer';
const execa = require('execa');

import * as path from 'path';
import * as os from 'os';
// # Setting PATH for Python 3.7
// # The original version is saved in .bash_profile.pysave
// PATH="/Library/Frameworks/Python.framework/Versions/3.7/bin:${PATH}"
// eval "$(rbenv init -)"

export const PINS_FILE = path.join(os.homedir(), '.pins.json');
export const PINS_ALIASES = path.join(os.homedir(), '.pins');
export const BASH_FILE = path.join(os.homedir(), '.bashrc');
export const BASH_FILE_BACKUP = path.join(os.homedir(), '.bashrc.saved_by_pin');

const tmpDir = '/tmp/';
export const BASH_FILE_TMP = `${tmpDir}.bashrc.tmp`;
export const PINS_ALIASES_TMP = `${tmpDir}.pins.tmp`;
export const PINS_FILE_TMP = `${tmpDir}.pins.json.tmp`;
export const BASH_FILE_BACKUP_TMP = `${tmpDir}.bashrc.saved_by_pin.tpm`;

interface Pin {
  name: string;
  path: string;
}

interface PinFile {
  createdAt: number;
  updatedAt: number;
  pins: Pin[];
}

export async function askForPinName(message?: string) {
  const { name }: { name: string } = await prompt({
    type: 'input',
    name: 'name',
    message: message || 'Give this pin a memorable name',
  });
  return name;
}

function now(): number {
  return new Date().getTime();
}
function createPinsJson() {
  console.log('createJsonfile');
  const pinFile: PinFile = { createdAt: now(), updatedAt: now(), pins: [] };
  fs.writeFileSync(PINS_FILE, JSON.stringify(pinFile));
}

function addPinsFileToBashFile() {
  console.log('addPinsFileToBashFile');
  let bashContent = readFile(BASH_FILE);
  bashContent = bashContent.replace(/(#pins.*)/g, '');
  bashContent = bashContent.replace(/\. \~\/\.pins/g, '');
  bashContent = bashContent + `\n#pins`;
  bashContent = bashContent + `\n. ~/.pins`;
  fs.writeFileSync(BASH_FILE, bashContent);
}

function creteBashFileBackup() {
  fs.copyFileSync(BASH_FILE, BASH_FILE_BACKUP);
}

function createPinAliasesFile() {
  fs.writeFileSync(PINS_ALIASES);
}

export function createPinsFile() {
  if (checkIfFileExists(PINS_ALIASES) && checkIfFileExists(PINS_FILE)) {
    console.log('both PINS_ALIASES and PINS_FILE exists');
    return;
  }
  try {
    creteBashFileBackup();
    createPinAliasesFile();
    createPinsJson();
    addPinsFileToBashFile();
  } catch (err) {
    console.log(err);
  }
}

export function pinAlreadyExists(pin: string): boolean {
  const pinsContent = readFile(PINS_ALIASES);
  return pinsContent.includes(`alias ${pin}="`);
}

interface AddPin {
  name: string;
  force?: boolean;
}

export async function addPin({ name, force = false }: AddPin) {
  try {
    createPinsFile();
    // fs.copyFileSync(PINS_ALIASES, PINS_FILE_TMP);
    let pinsFile = readJson<PinFile>(PINS_FILE);
    console.log('pinsFile', pinsFile);
    let newPins;
    if (force) {
      newPins = [
        ...pinsFile.pins.filter(pin => pin.name !== name),
        { name, path: process.cwd() },
      ];
    } else {
      if (pinsFile.pins.find(pin => pin.name === name)) {
        console.log(chalk.blue('A pin with this name already exists'));
        const { overwrite } = await prompt({
          type: 'confirm',
          name: 'overwrite',
          message: 'Overwrite?',
        });
        console.log('answer', overwrite);
        if (overwrite === true) {
          addPin({ name, force: true });
          return;
        } else {
          console.log('NOT OVERWRITE');
          let newName;
          try {
            newName = await askForPinName('Choose another name');
          } catch (error) {}
          if (!newName) {
            return;
          }
          addPin({ name: newName });
          return;
        }
      } else {
        newPins = [...pinsFile.pins, { name, path: process.cwd() }];
      }
    }
    console.log(newPins);

    const newPinsFile: PinFile = {
      ...pinsFile,
      updatedAt: now(),
      pins: newPins,
    };
    console.log(newPinsFile);
    const pinsAliases = newPins
      .map(pin => `alias ${pin.name}="cd ${pin.path}"\n`)
      .join('');
    console.log('pinsAliases', pinsAliases);
    fs.writeFileSync(PINS_FILE, JSON.stringify(newPinsFile));
    fs.writeFileSync(PINS_ALIASES, pinsAliases);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong');
  } finally {
    // if (checkIfFileExists(PINS_ALIASES)) {
    //   fs.unlinkSync(PINS_ALIASES);
    // }
  }
}

export function clear() {
  try {
    if (checkIfFileExists(PINS_ALIASES)) {
      fs.unlinkSync(PINS_ALIASES);
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

export function readJson<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

export function getPinList(): Pin[] {
  let pinsFileContent = readJson<PinFile>(PINS_FILE);

  // console.log(pinsFileContent);
  // const pinsList = pinsFileContent
  //   .replace(/\alias /g, '')
  //   .replace(/"/g, '')
  //   .split('\n')
  //   .filter(line => line)
  //   .map(line => {
  //     const lineSplitted = line.split('=');
  //     return {
  //       name: lineSplitted[0],
  //       path: lineSplitted[1],
  //     };
  //   });
  // console.log(pinsList);
  return pinsFileContent.pins;
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
