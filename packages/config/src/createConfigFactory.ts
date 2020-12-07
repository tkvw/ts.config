export type SyncOrAsync<T> = T | Promise<T>;

export interface ConfigMerge<Input, Config, Result> {
  (input: Input, config: Config): Result;
}

export interface ConfigSource<
  Input,
  ConfigSchema = Input,
  ConfigSourceOptionProps extends {} = unknown
> {
  (
    data: Input,
    options: Partial<ConfigSourceOptionProps> & {
      merge: (input: Input, data: any) => Partial<ConfigSchema>;
    }
  ): SyncOrAsync<Partial<ConfigSchema>>;
}

export interface CreateConfigOptions {
  merge?: <A, B>(data: A, other: B) => A & B;
}

export function createConfigFactory<Input extends {} = {}>(
  options: CreateConfigOptions = {}
) {
  const {
    merge = (a, b) => ({
      ...a,
      ...b,
    }),
  } = options;

  function createConfig<ConfigSchema, ConfigOptions extends {}>(
    configSource: ConfigSource<
      Input & Partial<ConfigSchema>,
      ConfigSchema,
      ConfigOptions
    >,
    validate: (
      config: ConfigSchema
    ) => Promise<ConfigSchema> | ConfigSchema = x => x
  ) {
    return async function configSourceProxy(
      defaults?: Input & Partial<ConfigSchema>,
      options?: Partial<ConfigOptions>
    ) {
      const result = await configSource(defaults, {
        merge,
        ...options,
      });
      const valid = await validate(result as ConfigSchema);

      if (valid) {
        return result;
      }
      throw new Error('Config schema could not be validated');
    };
  }

  return createConfig;
}

export const loadConfig = createConfigFactory();
