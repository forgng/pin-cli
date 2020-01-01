const fs = require('fs');
import { prompt } from 'enquirer';
import * as os from 'os';
import * as path from 'path';
import { Pin, PinFile } from './types';

export const PINS_FILE = path.join(os.homedir(), '.pins.json');
export const PINS_ALIASES = path.join(os.homedir(), '.pins');
export const BASH_FILE = path.join(os.homedir(), '.bashrc');
export const BASH_FILE_BACKUP = path.join(os.homedir(), '.bashrc.saved_by_pin');

// const tmpDir = '/tmp/';
// export const BASH_FILE_TMP = `${tmpDir}.bashrc.tmp`;
// export const PINS_ALIASES_TMP = `${tmpDir}.pins.tmp`;
// export const PINS_FILE_TMP = `${tmpDir}.pins.json.tmp`;
// export const BASH_FILE_BACKUP_TMP = `${tmpDir}.bashrc.saved_by_pin.tpm`;

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

export function nuke() {
  try {
    if (checkIfPathExists(PINS_ALIASES)) {
      fs.unlinkSync(PINS_ALIASES);
    }
    if (checkIfPathExists(PINS_ALIASES)) {
      fs.unlinkSync(PINS_ALIASES);
    }
    let bashContent = readFile(BASH_FILE);
    bashContent = bashContent.replace(/(#pins.*)/g, '');
    bashContent = bashContent.replace(/\. \~\/\.pins/g, '');

    fs.writeFileSync(BASH_FILE, bashContent);
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
  const pinNames = pins.map(pin => pin.name);
  let pinsFile = readJson<PinFile>(PINS_FILE);
  const newPins = pinsFile.pins.filter(pin => !pinNames.includes(pin.name));
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
