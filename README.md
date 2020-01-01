# pin

Pin your most used folders. Quickly teleport to pinned locations. Guarantee to save up to 10 seconds.

- [Usage](#usage)
- [Commands](#commands)

## Usage

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

## Commands

- [pin](#pin)
  - [Usage](#usage)
  - [Commands](#commands)
    - [pin add [PIN]](#pin-add-pin)
    - [pin clean [FILE]](#pin-clean-file)
  - [pin clear [FILE]](#pin-clear-file)
  - [pin delete](#pin-delete)
  - [pin help [COMMAND]](#pin-help-command)
  - [pin list [FILE]](#pin-list-file)
  - [pin nuke [FILE]](#pin-nuke-file)
  - [pin search](#pin-search)

### `pin add [PIN]`

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

### `pin clean [FILE]`

Remove all invalid pins

```
USAGE
  $ pin clean [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/clean.ts](https://github.com/forgng/pin/blob/v0.0.1/src/commands/clean.ts)_

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

## `pin delete`

describe the command here

```
USAGE
  $ pin delete

OPTIONS
  -f, --force
  -h, --help   show CLI help
```

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

## `pin list [FILE]`

describe the command here

```
USAGE
  $ pin list [FILE]

OPTIONS
  -h, --help  show CLI help
```

## `pin nuke [FILE]`

describe the command here

```
USAGE
  $ pin nuke [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

## `pin search`

describe the command here

```
USAGE
  $ pin search

EXAMPLE
  $ pin search
```
