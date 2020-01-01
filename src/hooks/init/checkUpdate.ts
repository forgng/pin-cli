import { Hook } from '@oclif/config';
const updateNotifier = require('update-notifier');
const pkg = require('../../../package.json');

const hook: Hook<'init'> = async function(opts) {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
  notifier.notify();
};

export default hook;
