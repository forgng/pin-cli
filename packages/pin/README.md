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
* [`pin add [FILE]`](#pin-add-file)
* [`pin clear [FILE]`](#pin-clear-file)
* [`pin hello [FILE]`](#pin-hello-file)
* [`pin help [COMMAND]`](#pin-help-command)
* [`pin list`](#pin-list)

## `pin add [FILE]`

Add a new pin

```
USAGE
  $ pin add [FILE]

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

## `pin hello [FILE]`

describe the command here

```
USAGE
  $ pin hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ pin hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/hello.ts)_

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

## `pin list`

describe the command here

```
USAGE
  $ pin list

EXAMPLE
  $ pin list
```

_See code: [src/commands/list.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/list.ts)_
<!-- commandsstop -->