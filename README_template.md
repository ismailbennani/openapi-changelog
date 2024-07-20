# OpenAPI Changelog

## Demo

[https://openapi-changelog.github.io/openapi-changelog/](https://openapi-changelog.github.io/openapi-changelog/)

## Installation

```
npm i openapi-changelog
```

## Usage

### CLI

```
{{shell openapi-changelog help}}
```

### API

```ts
import { openapiChangelog } from "openapi-changelog"
import * as fs from "fs";

const oldSpecificationContent = fs.readFileSync("path/to/new/spec.json", "utf8");
const oldSpecification = JSON.parse(oldSpecificationContent);

const newSpecificationContent = fs.readFileSync("path/to/old/spec.json", "utf8");
const newSpecification = JSON.parse(newSpecificationContent);

const result: string = openapiChangelog([oldSpecification, newSpecification]);
console.log(result);
```

## Examples

### [OpenAI v1.3](https://github.com/openai/openai-openapi/releases/tag/1.3.0) to [OpenAI v2](https://github.com/openai/openai-openapi/releases/tag/2.0.0)

```
> openapi-changelog examples/openai/v1.3.0.yaml examples/openai/v2.0.0.yaml
{{include examples/openai/API-CHANGELOG.md}}
```

See [examples/openai/API-CHANGELOG.md](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/openai/API-CHANGELOG.md)

As markdown:

{{include examples/openai/API-CHANGELOG.md}}

### [OpenAI v1.3](https://github.com/openai/openai-openapi/releases/tag/1.3.0) to [OpenAI v2](https://github.com/openai/openai-openapi/releases/tag/2.0.0) with details

```
> openapi-changelog examples/openai/v1.3.0.yaml examples/openai/v2.0.0.yaml --detailed
{{include examples/openai/API-CHANGELOG.detailed.md}}
```

See [examples/openai/API-CHANGELOG.detailed.md](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/openai/API-CHANGELOG.detailed.md)

As markdown:

{{include examples/openai/API-CHANGELOG.detailed.md}}

### [Google Maps v1.5.1](https://github.com/googlemaps/openapi-specification/releases/tag/v1.5.1) to [Google Maps v1.22.3](https://github.com/googlemaps/openapi-specification/releases/tag/v1.22.3)

```
> openapi-changelog examples/googlemaps/*.json --detailed --include-minor
```

<details>
  <summary>Raw output</summary>

```
{{include examples/googlemaps/API-CHANGELOG.detailed.md}}
```

</details>

<details>
  <summary>Markdown</summary>

{{include examples/googlemaps/API-CHANGELOG.detailed.md}}
</details>

See [examples/googlemaps/API-CHANGELOG.detailed.md](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/googlemaps/API-CHANGELOG.detailed.md)
