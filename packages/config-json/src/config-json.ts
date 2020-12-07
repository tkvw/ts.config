import * as fs from 'fs';
import { ConfigSource, SyncOrAsync } from '@tkvw/config';

export interface JsonConfigOptions {
  path: string;
  encoding?: BufferEncoding | null;
}

export function bindJsonSource<
  Input,
  Config extends Record<string, any>,
  Result
>(
  resolveJsonConfig: (
    data: Input
  ) => SyncOrAsync<
    JsonConfigOptions & {
      name?: string;
    }
  >,
  options?: {
    name?: string;
    merge?: (data: Input, configData: Config) => Result;
  }
): ConfigSource<
  Input,
  Result,
  {
    json: {
      [name: string]: Partial<JsonConfigOptions>;
    };
  }
> {
  return async (data, { json, ...rest }) => {
    const jsonConfig = await resolveJsonConfig(data);

    const { name = 'default', merge, ...jsonOptions } = {
      ...rest,
      ...options,
      ...jsonConfig,
    };
    const { path, encoding = 'utf8' } = {
      ...jsonOptions,
      ...json[name],
    };

    const jsonContents = await new Promise<string>((resolve, reject) => {
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

    return merge(data, JSON.parse(jsonContents) as Config);
  };
}
