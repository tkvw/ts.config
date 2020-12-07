import { ConfigSource, SyncOrAsync } from './createConfigFactory';

export function bindDefaults<
  Input,
  ConfigSourceData extends Record<string, any>,
  Result = Input & ConfigSourceData
>(
  configData: (data: Input) => SyncOrAsync<ConfigSourceData>,
  options?: {
    merge?: (data: Input, configData: ConfigSourceData) => Result;
  }
): ConfigSource<Input, Result> {
  return async (data, config) => {
    const { merge } = {
      ...config,
      ...options,
    };
    return merge(data, await configData(data));
  };
}
