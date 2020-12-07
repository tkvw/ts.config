import { ConfigSource } from './createConfigFactory';

export function bindMultiple<Input, Result, ConfigParams>(
  cs: ConfigSource<Input, Result, ConfigParams>
): ConfigSource<Input, Result, ConfigParams>;
export function bindMultiple<Input, R1, C1, R2, C2>(
  cs1: ConfigSource<Input, R1, C1>,
  cs2: ConfigSource<R1, R2, C2>
): ConfigSource<Input, R2, C1 & C2>;
export function bindMultiple<Input, R1, C1, R2, C2, R3, C3>(
  cs1: ConfigSource<Input, R1, C1>,
  cs2: ConfigSource<R1, R2, C2>,
  cs3: ConfigSource<R2, R3, C3>
): ConfigSource<Input, R3, C1 & C2 & C3>;
export function bindMultiple<Input, R1, C1, R2, C2, R3, C3, R4, C4>(
  cs1: ConfigSource<Input, R1, C1>,
  cs2: ConfigSource<R1, R2, C2>,
  cs3: ConfigSource<R2, R3, C3>,
  cs4: ConfigSource<R3, R4, C4>
): ConfigSource<Input, R4, C1 & C2 & C3 & C4>;
export function bindMultiple<Input, R1, C1, R2, C2, R3, C3, R4, C4, R5, C5>(
  cs1: ConfigSource<Input, R1, C1>,
  cs2: ConfigSource<R1, R2, C2>,
  cs3: ConfigSource<R2, R3, C3>,
  cs4: ConfigSource<R3, R4, C4>,
  cs5: ConfigSource<R4, R5, C5>
): ConfigSource<Input, R5, C1 & C2 & C3 & C4 & C5>;
export function bindMultiple(...plugins: ConfigSource<any, any>[]) {
  return async (data, params) => {
    for (const plugin of plugins) {
      data = await plugin(data, params);
    }
    return data;
  };
}
