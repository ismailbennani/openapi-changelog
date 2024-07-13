# OpenAPI Changelog

## Installation

```
npm i openapi-changelog
```

## Usage

### CLI

```
openapi-changelog <specifications...>

Compute the changelog between the old and the new openapi specifications

Positionals:
  specifications  Path or url to the openapi specifications                                                                         [string]

Options:
      --version  Show version number                                                                                               [boolean]
      --diff     Output a JSON containing the differences between the two specifications instead of a nicely formatted changelog   [boolean]
  -o, --output   Write the result to the corresponding file instead of stdout                                                       [string]
  -v, --verbose  Log stuff                                                                                        [boolean] [default: false]
  -D, --debug    Log additional debug information to log file                                                                       [string]
      --help     Show help                                                                                                         [boolean]
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
See [examples/openai/API-CHANGELOG](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/openai/API-CHANGELOG)

### [Google Maps v1.5.1](https://github.com/googlemaps/openapi-specification/releases/tag/v1.5.1) to [Google Maps v1.5.1](https://github.com/googlemaps/openapi-specification/releases/tag/v1.22.3)

```
> openapi-changelog examples/googlemaps/*.json
Version 1.22.2 - PATCH


Version 1.22.1 - PATCH


Version 1.22.0 - PATCH


Version 1.21.1 - MINOR

...
```
See [examples/googlemaps/API-CHANGELOG](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/googlemaps/API-CHANGELOG)
