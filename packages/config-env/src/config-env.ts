import { ConfigMerge, ConfigSource } from '@tkvw/config';

export interface EnvConfigOptions {
  include?: (
    key: string,
    value: any
  ) =>
    | {
        [key: string]: any;
      }
    | undefined
    | boolean;
}

export function bindEnvSource<
  Input,
  ConfigSourceData extends Record<string, any>,
  Result
>(
  resolveEnvConfig?: (data: Input) => EnvConfigOptions,
  options?: {
    name?: string;
    merge?: ConfigMerge<Input, ConfigSourceData, Result>;
  }
): ConfigSource<
  Input,
  Result,
  {
    env: {
      [name: string]: EnvConfigOptions;
    };
  }
> {
  return async (data, { env = {}, ...rest }) => {
    const envConfig = await resolveEnvConfig(data);

    const { name = 'default', merge, ...dotEnvOptions } = {
      ...rest,
      ...options,
      ...envConfig,
    };

    const { include } = {
      ...dotEnvOptions,
      ...env[name],
    };

    const result = Object.keys(process.env).reduce((acc, item) => {
      const envValue = process.env[item];
      const includeResult = include(item, envValue);
      if (true === includeResult) {
        acc[item] = envValue;
      } else if (typeof includeResult === 'object') {
        acc = Object.assign(acc, includeResult);
      }
      return acc;
    }, {});

    return merge(data, result as ConfigSourceData);
  };
}
