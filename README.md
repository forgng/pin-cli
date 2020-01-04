# pin

Pin your most used locations. Quickly teleport to pinned locations. Guarantee to save up to 10 seconds.

- [How does it works](#how-does-it-works)
- [Install](#install)
- [Usage](#basic-usage)
- [Commands](#commands)

## How does it works

A pin is just an alias to a specific folder. All the new pins are added to a separate file (**.pins**). This files is then linked to the **.bashrc**

## Install

```sh-session
$ npm install -g pin
```

## Basic usage

Go to a directory you want to save

```sh-session
  $ cd /path-to-dir
  $ pin add <pin-name>
  $ <pin-name>
```

## Commands

- [pin add [PIN-NAME]](#pin-add-pin-name)
- [pin clean](#pin-clean)
- [pin delete](#pin-delete-pin-name)
- [pin help [COMMAND]](#pin-help-command)
- [pin list](#pin-list)
- [pin nuke](#pin-nuke)
- [pin search](#pin-search)

### `pin add [PIN-NAME]`

Pin the current location.

```
USAGE
  $ pin add [PIN-NAME]

ARGUMENTS
  PIN-NAME  pin name

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  pin name
```

### `pin clean`

Remove all the pins that point to non existing locations.

```
USAGE
  $ pin clean

OPTIONS
  -f, --force
  -h, --help       show CLI help
```

## `pin delete [PIN-NAME]`

Delete a specific pin or the pin to the current folder

```
USAGE
  $ pin delete [PIN-NAME]

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

## `pin list`

List all the pins

```
USAGE
  $ pin list

OPTIONS
  -h, --help  show CLI help
```

## `pin nuke`

Delete all the pins

```
USAGE
  $ pin nuke

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

## `pin search`

Search for a pin

```
USAGE
  $ pin search
```
