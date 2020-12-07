import { ConfigSource } from '@tkvw/config';

export interface JsConfigOptions {
  path: string;
  loaders?: [string, any][];
}

const loadedLoaders = {};

export function bindJsConfig<
  Input extends {},
  Config extends Record<string, any>,
  Result = Input & Config
>(
  resolveJsConfig: (
    data: Input
  ) => JsConfigOptions & {
    $tsHint?: Config;
    name?: string;
  },
  options?: {
    $tsHint?: Config;
    name?: string;
    merge?: (data: Input, configData: Config) => Result;
  }
): ConfigSource<
  Input,
  Result,
  {
    js: {
      [name: string]: JsConfigOptions;
    };
  }
> {
  return async (data, { js = {}, ...rest }) => {
    const jsConfig = await resolveJsConfig(data);

    const { $tsHint, name = 'default', merge, ...jsOptions } = {
      ...rest,
      ...options,
      ...jsConfig,
    };

    const { loaders = [], path } = {
      ...jsOptions,
      ...js[name],
    };

    loaders.forEach(t => {
      const [loader, loaderOptions] = t;
      if (loadedLoaders[loader]) return;

      try {
        require(loader)(loaderOptions);
        loadedLoaders[loader] = true;
      } catch (error) {
        throw new Error(
          `Failed to load configured loader ${loader} for file ${path}`
        );
      }
    });

    let result = require(path);
    if (typeof result === 'function') {
      result = await result(data);
    }

    return merge(data, result as Config);
  };
}
