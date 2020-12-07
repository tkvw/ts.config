# My personal config tool

A configuration tool to bind all different kind of configuration sources.
`Input => ConfigSources => Result`
Plug every configuration source you like and return a simple javascript object.

## Usage

Install all configuration components you want to use
```
# Required
yarn add @tkvw/config

# Yaml config
yarn add @tkvw/config @tkvw/yaml
```

## Configure

```typescript
import findUp from "find-up";
import {loadConfig} from "@tkvw/config";
import {loadYamlConfig} from "@tkvw/config-yaml";

(async function(){
    const config = await loadConfig(
        loadYamlConfig({
            path: findUp(["myapp.yml","myapp.yaml"])
        })
    );

})();
```

