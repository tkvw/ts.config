import * as fs from 'fs';
import * as $yaml from 'js-yaml';
import { ConfigSource, SyncOrAsync } from '@tkvw/config';

export interface YamlConfigOptions {
  path: string;
  encoding?: BufferEncoding | null;
  parser?: $yaml.LoadOptions;
}

export function bindYamlSource<
  Input,
  Config extends Record<string, any>,
  Result
>(
  resolveYamlConfig: (
    data: Input
  ) => SyncOrAsync<
    YamlConfigOptions & {
      $tsHint?: Config;
      name?: string;
    }
  >,
  options?: {
    $tsHint?: Config;
    name?: string;
    merge?: (data: Input, configData: Config) => Result;
  }
): ConfigSource<
  Input,
  Result,
  {
    yaml: {
      [name: string]: Partial<YamlConfigOptions>;
    };
  }
> {
  return async (data, { yaml, ...rest }) => {
    const yamlConfig = await resolveYamlConfig(data);

    const { $tsHint, name = 'default', merge, ...yamlOptions } = {
      ...rest,
      ...options,
      ...yamlConfig,
    };
    const { path, encoding = 'utf8', parser } = {
      ...yamlOptions,
      ...yaml[name],
    };

    const yamlContents = await new Promise<string>((resolve, reject) => {
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

    return merge(data, $yaml.safeLoad(yamlContents, parser) as Config);
  };
}
