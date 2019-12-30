pin
===

manage aliases like a pro

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pin.svg)](https://npmjs.org/package/pin)
[![Downloads/week](https://img.shields.io/npm/dw/pin.svg)](https://npmjs.org/package/pin)
[![License](https://img.shields.io/npm/l/pin.svg)](https://github.com/forgng/pin/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g pin
$ pin COMMAND
running command...
$ pin (-v|--version|version)
pin/0.0.1 darwin-x64 node-v10.16.0
$ pin --help [COMMAND]
USAGE
  $ pin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pin add [PIN]`](#pin-add-pin)
* [`pin clear [FILE]`](#pin-clear-file)
* [`pin delete [FILE]`](#pin-delete-file)
* [`pin help [COMMAND]`](#pin-help-command)
* [`pin list [FILE]`](#pin-list-file)
* [`pin search`](#pin-search)

## `pin add [PIN]`

Add a new pin

```
USAGE
  $ pin add [PIN]

ARGUMENTS
  PIN  Name for the pin

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/add.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/add.ts)_

## `pin clear [FILE]`

describe the command here

```
USAGE
  $ pin clear [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/clear.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/clear.ts)_

## `pin delete [FILE]`

describe the command here

```
USAGE
  $ pin delete [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/delete.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/delete.ts)_

## `pin help [COMMAND]`

display help for pin

```
USAGE
  $ pin help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `pin list [FILE]`

describe the command here

```
USAGE
  $ pin list [FILE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/list.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/list.ts)_

## `pin search`

describe the command here

```
USAGE
  $ pin search

EXAMPLE
  $ pin search
```

_See code: [src/commands/search.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/search.ts)_
<!-- commandsstop -->
