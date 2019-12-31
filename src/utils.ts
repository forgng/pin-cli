const fs = require('fs');
const chalk = require('chalk');
import { prompt } from 'enquirer';
const execa = require('execa');

import * as path from 'path';
import * as os from 'os';
import { PinFile, Pin } from './commands/types';
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

export async function askForPinName(message?: string): Promise<string> {
  const { name }: { name: string } = await prompt({
    type: 'input',
    name: 'name',
    message: message || 'Give this pin a memorable name',
  });
  return name;
}

export function now(): number {
  return new Date().getTime();
}

export function writeToFile(file: string, content: string) {
  fs.writeFileSync(file, content);
}

function createPinsJson() {
  const pinFile: PinFile = { createdAt: now(), updatedAt: now(), pins: [] };
  fs.writeFileSync(PINS_FILE, JSON.stringify(pinFile));
}

function addPinsFileToBashFile() {
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

export function createPinsFileIfNotExists() {
  if (checkIfPathExists(PINS_ALIASES) && checkIfPathExists(PINS_FILE)) {
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

// export function pinAlreadyExists(pin: string): boolean {
//   const pinsContent = readFile(PINS_ALIASES);
//   return pinsContent.includes(`alias ${pin}="`);
// }

export function clear() {
  try {
    if (checkIfPathExists(PINS_ALIASES)) {
      fs.unlinkSync(PINS_ALIASES);
    }
    if (checkIfPathExists(BASH_FILE_BACKUP)) {
      fs.unlinkSync(BASH_FILE_BACKUP);
    }
    copyFile(BASH_FILE, BASH_FILE_TMP);
    let bashContent = readFile(BASH_FILE);
    bashContent = bashContent.replace(/(#pins.*)/g, '');
    bashContent = bashContent.replace(/\. \~\/\.pins/g, '');
    console.log('bashContent', bashContent);
    fs.writeFileSync(BASH_FILE, bashContent);

    if (checkIfPathExists(PINS_FILE_TMP)) {
      fs.unlinkSync(PINS_FILE_TMP);
    }
    if (checkIfPathExists(BASH_FILE_BACKUP_TMP)) {
      fs.unlinkSync(BASH_FILE_BACKUP_TMP);
    }
    if (checkIfPathExists(BASH_FILE_TMP)) {
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
  return pinsFileContent.pins;
}

export function updatePinList(newPinList: Pin[]) {
  let pinsFile = readJson<PinFile>(PINS_FILE);
  const newPinsFile: PinFile = {
    ...pinsFile,
    updatedAt: now(),
    pins: newPinList,
  };
  const pinsAliases = newPinList
    .map(pin => `alias ${pin.name}="cd ${pin.path}"\n`)
    .join('');
  writeToFile(PINS_FILE, JSON.stringify(newPinsFile));
  writeToFile(PINS_ALIASES, pinsAliases);
}

export function addPin(pin: Pin) {
  let pinsFile = readJson<PinFile>(PINS_FILE);
  let newPins = [...pinsFile.pins.filter(p => p.name !== pin.name), pin];
  const newPinsFile: PinFile = {
    ...pinsFile,
    updatedAt: now(),
    pins: newPins,
  };
  const pinsAliases = newPins
    .map(pin => `alias ${pin.name}="cd ${pin.path}"\n`)
    .join('');
  writeToFile(PINS_FILE, JSON.stringify(newPinsFile));
  writeToFile(PINS_ALIASES, pinsAliases);
}

export function removePins(pins: Pin[]) {
  console.log('pins', pins);
  const pinNames = pins.map(pin => pin.name);
  console.log(pinNames);
  let pinsFile = readJson<PinFile>(PINS_FILE);
  const newPins = pinsFile.pins.filter(pin => !pinNames.includes(pin.name));
  console.log(newPins);
  const newPinsFile: PinFile = {
    ...pinsFile,
    updatedAt: now(),
    pins: newPins,
  };
  const pinsAliases = newPins
    .map(pin => `alias ${pin.name}="cd ${pin.path}"\n`)
    .join('');
  writeToFile(PINS_FILE, JSON.stringify(newPinsFile));
  writeToFile(PINS_ALIASES, pinsAliases);
}

export function getPinByPath(path: string): Pin[] {
  let pinsFileContent = readJson<PinFile>(PINS_FILE);
  const pins = pinsFileContent.pins;
  return pins.filter(pin => pin.path === path);
}

export function getPinByName(name: string): Pin | undefined {
  let pinsFileContent = readJson<PinFile>(PINS_FILE);
  const pins = pinsFileContent.pins;
  return pins.find(pin => pin.name === name);
}

export function getPinsThatUsesCurrentPath(): Pin[] {
  let pinsFileContent = readJson<PinFile>(PINS_FILE);
  const currentPath = process.cwd();
  return pinsFileContent.pins.filter(pin => pin.path === currentPath);
}

export const checkIfPathExists = (path: string): boolean => fs.existsSync(path);
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
