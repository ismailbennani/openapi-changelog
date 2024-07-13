# OpenAPI Changelog

## Installation

```
npm i openapi-changelog
```

## Usage

### CLI

```
openapi-changelog <old_openapi_spec> <new_openapi_spec> [options]

Compute the changelog between the old and the new openapi specifications

Positionals:
  old_openapi_spec  Path or url to the old openapi specification                                                                    [string]
  new_openapi_spec  Path or url to the new openapi specification                                                                    [string]

Options:
  -h, --help     Show help                                                                                                         [boolean]
      --version  Show version number                                                                                               [boolean]
      --diff     Output a JSON containing the differences between the two specifications instead of a nicely formatted changelog   [boolean]
  -o, --output   Write the result to the corresponding file instead of stdout                                                       [string]
  -v, --verbose  Log stuff                                                                                        [boolean] [default: false]
  -D, --debug    Log debug information to log file (default: debug.log)                                                             [string]
```

### API

```ts
import * as OpenApiChangelog from "openapi-changelog"
import * as fs from "fs";

const oldSpecificationContent = fs.readFileSync("path/to/new/spec.json", "utf8");
const oldSpecification = JSON.parse(oldSpecificationContent);

const newSpecificationContent = fs.readFileSync("path/to/old/spec.json", "utf8");
const newSpecification = JSON.parse(newSpecificationContent);

OpenApiChangelog.diff(oldSpecification, newSpecification);
```

## Examples

### [OpenAI v1.3](https://github.com/openai/openai-openapi/releases/tag/1.3.0) to [OpenAI v2](https://github.com/openai/openai-openapi/releases/tag/2.0.0)

```
> openapi-changelog examples/openai/v1.3.0.yaml examples/v2.0.0.yaml
Version 2.0.0 - MAJOR

> BREAKING CHANGES
  - Removed operation GET /engines
  - Removed operation GET /engines/{engine_id}
  - Removed operation POST /engines/{engine_id}/search
  - Removed operation POST /answers
  - Removed operation POST /classifications
```
