import * as $yargs from 'yargs';

import { ConfigSource } from '@tkvw/config';

export interface YargsConfigOptions<Input, Config> {
  (yargs: $yargs.Argv, data: Input): $yargs.Argv<Config>;
}

export function bindYargsSource<
  Input,
  Config extends Record<string, any>,
  Result = Input & Config
>(
  resolveYargs: YargsConfigOptions<Input, Config>,
  options?: {
    name?: string;
    merge?: (data: Input, config: Config) => Result;
  }
): ConfigSource<
  Input,
  Result,
  {
    yargs: {
      [name: string]: YargsConfigOptions<Input, Config>;
    };
  }
> {
  return async (data, { yargs = {}, ...rest }) => {
    let yargsInstance = $yargs(process.argv.slice(2));

    yargsInstance = await resolveYargs(yargsInstance, data);

    const { name = 'default', merge } = {
      ...rest,
      ...options,
    };

    if (yargs[name]) {
      yargsInstance = await yargs[name](yargsInstance, data);
    }
    const { _, $0, ...yargsOptions } = yargsInstance.argv;
    return merge(data, yargsOptions as Config);
  };
}
