import { Hook } from '@oclif/config';
import { createPinsFileIfNotExists } from '../../utils';

const hook: Hook<'init'> = async function(opts) {
  createPinsFileIfNotExists();
};

export default hook;
