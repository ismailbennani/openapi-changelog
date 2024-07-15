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
      --version        Show version number                                                                                         [boolean]
      --diff           Output a JSON containing the differences between the two specifications instead of a nicely formatted changelog
                                                                                                                                   [boolean]
      --template       Handlebars template to use to generate the changelog                                                         [string]
  -n, --limit          Max number of versions to consider when computing changelog. The limit will be applied AFTER sorting the versions,
                       the changelog will contain the N most recent versions.                                                       [number]
  -D, --detailed       Output a detailed description of the changes                                                                [boolean]
  -x, --exclude        Type of changes that should be excluded from the output                                                       [array]
      --include-minor  Include minor changes such as documentation changes in the output                                           [boolean]
  -o, --output         Write the result to the corresponding file instead of stdout                                                 [string]
  -v, --verbose        Log stuff                                                                                  [boolean] [default: false]
      --vverbose       [DEBUG] Very verbose, log debug information to a debug.log file                                             [boolean]
      --dump-ir        [DEBUG] Dump the intermediate representation generated for each openapi document in .ir files               [boolean]
      --dump-changes   [DEBUG] Dump the changes computed between each openapi document couple in .changes files                    [boolean]
      --help           Show help                                                                                                   [boolean]
```

### API

```ts
import * as OpenApiChangelog from "openapi-changelog"
import * as fs from "fs";

const oldSpecificationContent = fs.readFileSync("path/to/new/spec.json", "utf8");
const oldSpecification = JSON.parse(oldSpecificationContent);

const newSpecificationContent = fs.readFileSync("path/to/old/spec.json", "utf8");
const newSpecification = JSON.parse(newSpecificationContent);

const result: string = OpenApiChangelog.changelog([oldSpecification, newSpecification]);
console.log(result);
```

## Examples

### [OpenAI v1.3](https://github.com/openai/openai-openapi/releases/tag/1.3.0) to [OpenAI v2](https://github.com/openai/openai-openapi/releases/tag/2.0.0)

```
> openapi-changelog examples/openai/v1.3.0.yaml examples/openai/v2.0.0.yaml
Version 2.0.0 - MAJOR
  > BREAKING CHANGES
    - Removed operation GET /engines
    - Removed operation GET /engines/{engine_id}
    - Removed operation POST /engines/{engine_id}/search
    - Removed operation POST /answers
    - Removed operation POST /classifications

  > Changes
    - Changed documentation of operation POST /audio/translations
```
See [examples/openai/API-CHANGELOG](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/openai/API-CHANGELOG)

### [OpenAI v1.3](https://github.com/openai/openai-openapi/releases/tag/1.3.0) to [OpenAI v2](https://github.com/openai/openai-openapi/releases/tag/2.0.0) with details

```
> openapi-changelog examples/openai/v1.3.0.yaml examples/openai/v2.0.0.yaml --detailed
Version 2.0.0 - MAJOR
  > BREAKING CHANGES
    - Removed operation GET /engines
    - Removed operation GET /engines/{engine_id}
    - Removed operation POST /engines/{engine_id}/search
    - Removed operation POST /answers
    - Removed operation POST /classifications

  > Changes
    - Changed documentation of operation POST /audio/translations

      Translates audio into English.
```

See [examples/openai/API-CHANGELOG](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/openai/API-CHANGELOG)

### [Google Maps v1.5.1](https://github.com/googlemaps/openapi-specification/releases/tag/v1.5.1) to [Google Maps v1.5.1](https://github.com/googlemaps/openapi-specification/releases/tag/v1.22.3)

```
> openapi-changelog examples/googlemaps/*.json --detailed -n 20
Version 1.22.3 - PATCH
  No changes

Version 1.22.2 - PATCH
  No changes

Version 1.22.1 - PATCH
  > Changes
    - Changed documentation of operation GET /v1/nearestRoads

      This service returns individual road segments for a given set of GPS coordinates. This services takes up to 100 GPS
      points and returns the closest road segments for each point. The points passed do not need to be part of a
      continuous path.

Version 1.22.0 - MINOR
  No changes

Version 1.21.1 - PATCH
  No changes

Version 1.21.0 - MINOR
  No changes

Version 1.20.0 - MINOR
  No changes

Version 1.19.1 - PATCH
  No changes

Version 1.19.0 - MINOR
  No changes

Version 1.18.0 - MINOR
  No changes

Version 1.17.17 - PATCH
  No changes

Version 1.17.16 - PATCH
  No changes

Version 1.17.15 - PATCH
  No changes

Version 1.17.14 - PATCH
  No changes

Version 1.17.13 - MINOR
  > BREAKING CHANGES
    - Removed operation GET /v1/snapToRoads
    - Removed operation GET /maps/api/distanceMatrix/json
    - In operation GET /maps/api/directions/json
      - Removed parameter origin
      - Removed parameter destination
      - Removed parameter waypoints
      - Removed parameter alternatives
      - Removed parameter avoid
      - Removed parameter units
      - Removed parameter arrival_time
      - Removed parameter departure_time
      - Removed parameter traffic_model
      - Removed parameter transit_mode
      - Removed parameter transit_routing_preference
    - In operation GET /maps/api/elevation/json
      - Removed parameter locations
      - Removed parameter path
      - Removed parameter samples
    - In operation GET /maps/api/geocode/json
      - Removed parameter address
      - Removed parameter components
      - Removed parameter latlng
      - Removed parameter bounds
    - In operation GET /maps/api/timezone/json
      - Removed parameter location
      - Removed parameter timestamp
    - In operation GET /v1/nearestRoads
      - Removed parameter points

  > Changes
    - Changed documentation of operation GET /maps/api/geocode/json

      The Geocoding API is a service that provides geocoding and reverse geocoding of addresses.

      **Geocoding** is the process of converting addresses (like a street address) into geographic coordinates (like
      latitude and longitude), which you can use to place markers on a map, or position the map.

      **Reverse geocoding** is the process of converting geographic coordinates into a human-readable address.

      You can also use the Geocoding API to find the address for a given place ID.

      To see countries currently supported by the Google Maps Platform Geocoding API, please consult the [Google Maps
      coverage data](https://developers.google.com/maps/coverage). The accuracy of geocoded locations may vary per
      country, so you should consider using the returned `location_type` field to determine if a good enough match has
      been found for the purposes of your application. Please note that the availability of geocoding data depends on our
      contracts with data providers, so it is subject to change.

Version 1.10.5 - PATCH
  No changes

Version 1.10.4 - PATCH
  No changes

Version 1.10.3 - PATCH
  No changes

Version 1.10.2 - PATCH
  No changes

Version 1.10.1 - PATCH
  No changes

Version 1.10.0 - MINOR
  > BREAKING CHANGES
    - In operation GET /maps/api/directions/json
      - Removed parameter mode
    - In operation GET /maps/api/distanceMatrix/json
      - Removed parameter mode

Version 1.9.0 - MINOR
  No changes

Version 1.8.1 - PATCH
  No changes

Version 1.8.0 - MINOR
  No changes

Version 1.7.1 - PATCH
  No changes

Version 1.7.0 - MINOR
  No changes

Version 1.6.0 - MINOR
  No changes

Version 1.5.3 - PATCH
  No changes

Version 1.5.2 - PATCH
  No changes
```
See [examples/googlemaps/API-CHANGELOG](https://github.com/OpenAPI-Changelog/openapi-changelog/blob/main/examples/googlemaps/API-CHANGELOG)
