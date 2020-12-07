import * as fs from 'fs';
import * as $toml from 'toml';
import { ConfigSource, SyncOrAsync } from '@tkvw/config';

export interface TomlConfigOptions {
  path: string;
  encoding?: BufferEncoding | null;
}

export function bindTomlSource<
  Input,
  Config extends Record<string, any>,
  Result = Input & Config
>(
  resolveTomlConfig: (
    data: Input
  ) => SyncOrAsync<
    TomlConfigOptions & {
      $tsHint?: Config;
    }
  >,
  options?: {
    name?: string;
    $tsHint?: Config;
    merge?: (data: Input, configData: Config) => Result;
  }
): ConfigSource<
  Input,
  Result,
  {
    toml: {
      [name: string]: TomlConfigOptions;
    };
  }
> {
  return async (data, { toml = {}, ...rest }) => {
    const tomlConfig = await resolveTomlConfig(data);

    const { $tsHint, name = 'default', merge, ...tomlOptions } = {
      ...rest,
      ...options,
      ...tomlConfig,
    };

    const { path, encoding = 'utf8' } = {
      ...tomlOptions,
      ...toml[name],
    };

    const tomlContents = await new Promise<string>((resolve, reject) => {
      fs.readFile(
        path,
        {
          encoding,
        },
        (err, data) => {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
    return merge(data, $toml.parse(tomlContents));
  };
}
