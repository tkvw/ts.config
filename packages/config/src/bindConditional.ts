import { ConfigSource } from './createConfigFactory';

export function bindConditional<Input, Result>(
  condition: (data: Input) => boolean | Promise<boolean>,
  configSourceSuccess: ConfigSource<Input, Result>,
  configSourceFailed: ConfigSource<Input, Result>
): ConfigSource<Input, Result> {
  return async (data, options) => {
    const conditionResult = await condition(data);
    if (conditionResult) {
      return configSourceSuccess(data, options);
    }
    return configSourceFailed(data, options);
  };
}
