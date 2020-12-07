import { bindMultiple, loadConfig, bindDefaults } from '@tkvw/config';
import { bindDotEnvSource } from '@tkvw/config-dotenv';
import { bindEnvSource } from '@tkvw/config-env';
import { bindYargsSource } from '@tkvw/config-yargs';

function assertSchema<Schema>(
  validator: (config: Schema) => Promise<Schema> | Schema = (config: Schema) =>
    config
) {
  return validator;
}

(async function () {
  const result = await loadConfig(
    bindMultiple(
      bindDefaults(() => ({
        path: '',
      })),
      bindDefaults(() => ({
        bar: '',
      })),
      bindDotEnvSource(() => ({
        path: '',
      })),
      bindYargsSource(yargs =>
        yargs.option('name', {
          default: 'Dennie',
        })
      ),
      loadConfig(
        bindMultiple(
          bindDefaults(() => ({
            username: 'hihi',
          })),
          bindEnvSource(data => ({
            include: (key, value) => {
              return {
                [key]: value,
              };
            },
          }))
        )
      )
    ),
    assertSchema<{
      username: string;
      password: string;
    }>()
  )({
    username: '',
  });

  console.log(result);
})();
