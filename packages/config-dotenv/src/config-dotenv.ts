import * as $dotenv from 'dotenv';
import { ConfigSource, SyncOrAsync } from '@tkvw/config';

export function bindDotEnvSource<
  Input,
  ConfigSourceData extends Record<string, any>,
  Result = Input & ConfigSourceData
>(
  resolveDotEnvConfig: (
    data: Input
  ) => SyncOrAsync<$dotenv.DotenvConfigOptions>,
  options: {
    name?: string;
    merge?: (data: Input, configData: ConfigSourceData) => Result;
  } = {}
): ConfigSource<
  Input,
  Result,
  {
    dotenv: {
      [name: string]: $dotenv.DotenvConfigOptions;
    };
  }
> {
  return async (data, { dotenv = {}, ...rest }) => {
    const dotEnvConfig = await resolveDotEnvConfig(data);

    const { name = 'default', merge, ...dotEnvOptions } = {
      ...rest,
      ...options,
      ...dotEnvConfig,
    };

    const { error, parsed } = $dotenv.config({
      ...dotEnvOptions,
      ...dotenv[name],
    });

    return merge(data, parsed as ConfigSourceData);
  };
}
