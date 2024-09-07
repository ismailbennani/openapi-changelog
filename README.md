# OpenAPI Changelog

## Demo

[https://openapi-changelog.github.io/openapi-changelog/](https://openapi-changelog.github.io/openapi-changelog/)

## Installation

```
npm i ismailbennani/openapi-changelog
```

## Usage

### CLI

```
openapi-changelog <specifications...>

Compute the changelog between the old and the new openapi specifications

Positionals:
  specifications  Path or url to the openapi specifications  [string]

Options:
      --version        Show version number  [boolean]
      --diff           Output a JSON containing the differences between the two specifications instead of a nicely formatted changelog  [boolean]
      --template       Handlebars template to use to generate the changelog  [string]
  -n, --limit          Max number of versions to consider when computing changelog. The limit will be applied AFTER sorting the versions, the changelog will contain the N most recent versions.  [number]
  -D, --detailed       Output a detailed description of the changes  [boolean]
  -x, --exclude        Type of changes that should be excluded from the output  [array]
      --include-minor  Include minor changes such as documentation changes in the output  [boolean]
  -o, --output         Write the result to the corresponding file instead of stdout  [string]
  -v, --verbose        Log stuff  [boolean] [default: false]
      --vverbose       [DEBUG] Very verbose, log debug information to a debug.log file  [boolean]
      --dump-ir        [DEBUG] Dump the intermediate representation generated for each openapi document in .ir files  [boolean]
      --dump-changes   [DEBUG] Dump the changes computed between each openapi document couple in .changes files  [boolean]
      --help           Show help  [boolean]

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
Version 2.0.0 - MAJOR
  - BREAKING CHANGES
      - Removed operation GET /engines
      - Removed operation GET /engines/{engine_id}
      - Removed operation POST /engines/{engine_id}/search
      - Removed operation POST /answers
      - Removed operation POST /classifications

```

See [examples/openai/API-CHANGELOG.md](https://github.com/ismailbennani/openapi-changelog/blob/main/examples/openai/API-CHANGELOG.md)

As markdown:

Version 2.0.0 - MAJOR
  - BREAKING CHANGES
      - Removed operation GET /engines
      - Removed operation GET /engines/{engine_id}
      - Removed operation POST /engines/{engine_id}/search
      - Removed operation POST /answers
      - Removed operation POST /classifications


### [OpenAI v1.3](https://github.com/openai/openai-openapi/releases/tag/1.3.0) to [OpenAI v2](https://github.com/openai/openai-openapi/releases/tag/2.0.0) with details

```
> openapi-changelog examples/openai/v1.3.0.yaml examples/openai/v2.0.0.yaml --detailed --include-minor
Version 2.0.0 - MAJOR
  - BREAKING CHANGES
      - Removed operation GET /engines
      - Removed operation GET /engines/{engine_id}
      - Removed operation POST /engines/{engine_id}/search
      - Removed operation POST /answers
      - Removed operation POST /classifications

  - Changes
    - Changed documentation of operation POST /audio/translations
      - Changes:\
        ~~Translates audio into into English.~~\
        **Translates audio into English.**

```

See [examples/openai/API-CHANGELOG.detailed.md](https://github.com/ismailbennani/openapi-changelog/blob/main/examples/openai/API-CHANGELOG.detailed.md)

As markdown:

Version 2.0.0 - MAJOR
  - BREAKING CHANGES
      - Removed operation GET /engines
      - Removed operation GET /engines/{engine_id}
      - Removed operation POST /engines/{engine_id}/search
      - Removed operation POST /answers
      - Removed operation POST /classifications

  - Changes
    - Changed documentation of operation POST /audio/translations
      - Changes:\
        ~~Translates audio into into English.~~\
        **Translates audio into English.**


### [Google Maps v1.5.1](https://github.com/googlemaps/openapi-specification/releases/tag/v1.5.1) to [Google Maps v1.22.3](https://github.com/googlemaps/openapi-specification/releases/tag/v1.22.3)

```
> openapi-changelog examples/googlemaps/*.json --detailed --include-minor
```

<details>
  <summary>Raw output</summary>

```
Version 1.22.3 - PATCH
  - No changes

Version 1.22.2 - PATCH
  - Changes
    - Changed documentation of parameter nearestroads_points used in 1 endpoints
    
      - Used in GET /v1/nearestRoads
      - Changes:\
        ~~The path to be snapped. The path parameter accepts a list of latitude/longitude pairs. Latitude and longitude
        values should be separated by commas. Coordinates should be separated by the pipe character: "|". For example:
        \`path=60.170880,24.942795|60.170879,24.942796|60.170877,24.942796\`.~~\
        **The points to be snapped. The points parameter accepts a list of latitude/longitude pairs. Separate latitude
        and longitude values with commas. Separate coordinates with the pipe character: "|". For example:
        \`points=60.170880,24.942795|60.170879,24.942796|60.170877,24.942796\`.**\
        ~~<div class="note">Note: The snapping algorithm works best for points that are not too far apart. If you
        observe odd snapping behavior, try creating paths that have points closer together. To ensure the best
        snap-to-road quality, you should aim to provide paths on which consecutive pairs of points are within 300m of
        each other. This will also help in handling any isolated, long jumps between consecutive points caused by GPS
        signal loss, or noise.</div>~~

Version 1.22.1 - PATCH
  - Changes
    - Changed documentation of operation GET /v1/nearestRoads
      - Changes:\
        ~~This service returns individual road segments for a given set of GPS coordinates. This services takes up to
        100 GPS points and returns the closest road segment for each point. The points passed do not need to be part of
        a continuous path.~~\
        **This service returns individual road segments for a given set of GPS coordinates. This services takes up to
        100 GPS points and returns the closest road segments for each point. The points passed do not need to be part of
        a continuous path.**

Version 1.22.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Basic category includes the following fields: \`address_component\`, \`adr_address\`, \`business_status\`,
        \`formatted_address\`, \`geometry\`, \`icon\`, \`icon_mask_base_uri\`, \`icon_background_color\`, \`name\`,
        \`permanently_closed\` ([deprecated](https://developers.google.com/maps/deprecations)), \`photo\`, \`place_id\`,
        \`plus_code\`, \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`.~~\
        **The Basic category includes the following fields: \`address_component\`, \`adr_address\`, \`business_status\`,
        \`formatted_address\`, \`geometry\`, \`icon\`, \`icon_mask_base_uri\`, \`icon_background_color\`, \`name\`,
        \`permanently_closed\` ([deprecated](https://developers.google.com/maps/deprecations)), \`photo\`, \`place_id\`,
        \`plus_code\`, \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`, \`wheelchair_accessible_entrance\`.**\
        ~~The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`reviews\`, \`takeout\`, \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`reservable\`, \`reviews\`, \`serves_beer\`,
        \`serves_breakfast\`, \`serves_brunch\`, \`serves_dinner\`, \`serves_lunch\`, \`serves_vegetarian_food\`,
        \`serves_wine\`, \`takeout\`, \`user_ratings_total\`.**

Version 1.21.1 - PATCH
  - No changes

Version 1.21.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Contact category includes the following fields: \`formatted_phone_number\`,
        \`international_phone_number\`, \`opening_hours\`, \`website\`~~\
        **The Contact category includes the following fields: \`current_opening_hours\`, \`formatted_phone_number\`,
        \`international_phone_number\`, \`opening_hours\`, \`secondary_opening_hours\`, \`website\`**\
        ~~The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`reviews\`, \`takeout\`, \`user_ratings_total\`.**

Version 1.20.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.**\
        ~~<aside class="note"><strong>Note: </strong><code>curbside_pickup</code>, <code>delivery</code>,
        <code>dine_in</code>, and <code>takeout</code> are only supported for Place Details requests.
        </aside>~~

Version 1.19.1 - PATCH
  - Changes
    - Changed documentation of parameter places_reviewnotranslation used in 1 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Changes:\
        ~~Specify \`reviews_no_translations=true\` to enable translation of reviews; specify
        \`reviews_no_translations=false\` to disable translation of reviews. Reviews are returned in their original
        language.~~\
        **Specify \`reviews_no_translations=true\` to disable translation of reviews; specify
        \`reviews_no_translations=false\` to enable translation of reviews. Reviews are returned in their original
        language.**\
        ~~If omitted, translation of reviews is enabled. If the \`language\` parameter was specified in the request, use
        the specified language as the preferred language for translation. If \`language\` is omitted, the API attempts
        to use the \`Accept-Language\` header as the preferred language.~~\
        **If omitted, or passed with no value, translation of reviews is enabled. If the \`language\` parameter was
        specified in the request, use the specified language as the preferred language for translation. If \`language\`
        is omitted, the API attempts to use the \`Accept-Language\` header as the preferred language.**

Version 1.19.0 - MINOR
  - No changes

Version 1.18.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Atmosphere category includes the following fields: \`price_level\`, \`rating\`, \`review\`,
        \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.**\
        **<aside class="note"><strong>Note: </strong><code>curbside_pickup</code>, <code>delivery</code>,
        <code>dine_in</code>, and <code>takeout</code> are only supported for Place Details requests.
        </aside>**

Version 1.17.17 - PATCH
  - Changes
    - Changed documentation of parameter places_location used in 1 endpoints
    
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~The point around which to retrieve place information. This must be specified as \`latitude,longitude\`.~~\
        **The point around which to retrieve place information. This must be specified as \`latitude,longitude\`. The
        \`radius\` parameter must also be provided when specifying a location. If \`radius\` is not provided, the
        \`location\` parameter is ignored.**

Version 1.17.16 - PATCH
  - No changes

Version 1.17.15 - PATCH
  - Changes
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~Explicitly including location information using this parameter may conflict with the location, radius, and
        rank_by parameters, causing unexpected results.~~\
        **Explicitly including location information using this parameter may conflict with the location, radius, and
        rankby parameters, causing unexpected results.**
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rank_by\` parameter.~~\
        **\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rankby\` parameter.**\
        ~~\* When using \`rank_by=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.~~\
        **\* When using \`rankby=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.**

Version 1.17.14 - PATCH
  - No changes

Version 1.17.13 - PATCH
  - No changes

Version 1.17.12 - PATCH
  - Changes
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~Explicitly including location information using this parameter may conflict with the location, radius, and
        rankby parameters, causing unexpected results.~~\
        **Explicitly including location information using this parameter may conflict with the location, radius, and
        rank_by parameters, causing unexpected results.**
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rankby\` parameter.~~\
        **\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rank_by\` parameter.**\
        ~~\* When using \`rankby=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.~~\
        **\* When using \`rank_by=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.**

Version 1.17.11 - PATCH
  - Changes
    - Changed documentation of parameter directions_waypoints used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about billing</a>
        for Google Maps Platform products.</div>~~\
        **<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing-and-pricing/pricing\#directions-advanced">Learn more about
        billing</a> for Google Maps Platform products.</div>**\
        ~~<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers..google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about how Google
        Maps Platform products are billed.</a></div>~~\
        **<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing-and-pricing/pricing\#directions-advanced">Learn more about how
        Google Maps Platform products are billed.</a></div>**
    - Changed documentation of parameter distancematrix_origins used in 1 endpoints
    
      - Used in GET /maps/api/distancematrix/json
      - Changes:\
        ~~<div class="note">Note: using place IDs is preferred over using addresses or latitude/longitude coordinates.
        Using coordinates will always result in the point being snapped to the road nearest to those coordinates - which
        may not be an access point to the property, or even a road that will quickly or safely lead to the
        destination.</div>~~\
        **<div class="note">Note: using place IDs is preferred over using addresses or latitude/longitude coordinates.
        Using coordinates will always result in the point being snapped to the road nearest to those coordinates - which
        may not be an access point to the property, or even a road that will quickly or safely lead to the destination.
        Using the address will provide the distance to the center of the building, as opposed to an entrance to the
        building.</div>**

Version 1.17.10 - PATCH
  - Changes
    - Changed documentation of parameter directions_waypoints used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about
        how Google Maps Platform products are billed.</a></div>~~\
        **<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers..google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about how Google
        Maps Platform products are billed.</a></div>**
    - Changed documentation of parameter geocode_components used in 1 endpoints
    
      - Used in GET /maps/api/geocode/json
      - Changes:\
        ~~\* Results are consistent with Google Maps, which occasionally yields unexpected \`ZERO_RESULTS\` responses.
        Using Place Autocomplete may provide better results in some use cases. To learn more, see [this
        FAQ](https://developers.devsite.corp.google.com/maps/documentation/geocoding/faq\#trbl_component_filtering).~~\
        **\* Results are consistent with Google Maps, which occasionally yields unexpected \`ZERO_RESULTS\` responses.
        Using Place Autocomplete may provide better results in some use cases. To learn more, see [this
        FAQ](https://developers..google.com/maps/documentation/geocoding/faq\#trbl_component_filtering).**\
    
        \* For each address component, either specify it in the address parameter or in a components filter, but not
        both. Specifying the same values in both may result in \`ZERO_RESULTS\`.
    
        <div class="note">Note: At least one of \`address\` or \`components\` is required.</div>
    - Changed documentation of parameter places_types used in 1 endpoints
    
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~You may restrict results from a Place Autocomplete request to be of a certain type by passing a types
        parameter. The parameter specifies a type or a type collection, as listed in the supported types below. If
        nothing is specified, all types are returned. In general only a single type is allowed. The exception is that
        you can safely mix the geocode and establishment types, but note that this will have the same effect as
        specifying no types. The supported types are:~~\
        **You can restrict results from a Place Autocomplete request to be of a certain type by passing the \`types\`
        parameter. This parameter specifies a type or a type collection, as listed in [Place
        Types](/maps/documentation/places/web-service/supported_types). If nothing is specified, all types are
        returned.**\
        ~~- \`geocode\` instructs the Place Autocomplete service to return only geocoding results, rather than business
        results. Generally, you use this request to disambiguate results where the location specified may be
        indeterminate.~~\
        ~~- \`address\` instructs the Place Autocomplete service to return only geocoding results with a precise
        address. Generally, you use this request when you know the user will be looking for a fully specified
        address.~~\
        **For the value of the \`types\` parameter you can specify either:**\
        ~~- \`establishment\` instructs the Place Autocomplete service to return only business results.~~\
        **\* Up to five values from [Table 1](/maps/documentation/places/web-service/supported_types\#table1) or [Table
        2](/maps/documentation/places/web-service/supported_types\#table2). For multiple values, separate each value
        with a \`|\` (vertical bar). For example:**\
        ~~- \`(regions)\` type collection instructs the Places service to return any result matching the following
        types:~~\
        ~~- \`locality\`~~\
        **\`types=book_store|cafe\`**\
        ~~- \`sublocality\`~~\
        ~~- \`postal_code\`~~\
        **\* Any supported filter in [Table 3](/maps/documentation/places/web-service/supported_types\#table3). You can
        safely mix the \`geocode\` and \`establishment\` types. You cannot mix type collections (\`address\`,
        \`(cities)\` or \`(regions)\`) with any other type, or an error occurs.**\
        ~~- \`country\`~~\
        ~~- \`administrative_area_level_1\`~~\
        **The request will be rejected with an \`INVALID_REQUEST\` error if:**\
        ~~- \`administrative_area_level_2\`~~\
        ~~- \`(cities)\` type collection instructs the Places service to return results that match \`locality\` or
        \`administrative_area_level_3\`.~~\
        **\* More than five types are specified.**\
        **\* Any unrecognized types are present.
        \* Any types from in [Table 1](/maps/documentation/places/web-service/supported_types\#table1) or [Table
        2](/maps/documentation/places/web-service/supported_types\#table2) are mixed with any of the filters in [Table
        3](/maps/documentation/places/web-service/supported_types\#table3).**

Version 1.17.9 - PATCH
  - Changes
    - In operation GET /maps/api/place/findplacefromtext/json
      - Changed documentation of parameter input
        - Changes:\
          ~~Text input that identifies the search target, such as a name, address, or phone number. The input must be a
          string. Non-string input such as a lat/lng coordinate or plus code generates an error.~~\
          **The text string on which to search, for example: "restaurant" or "123 Main Street". This must be a place
          name, address, or category of establishments. Any other types of input can generate errors**\
          **and are not guaranteed to return valid results. The Places API will return candidate matches based on this
          string and order the results based on their perceived relevance.**
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~A term to be matched against all content that Google has indexed for this place, including but not limited to
        name and type, as well as customer reviews and other third-party content.~~\
        **The text string on which to search, for example: "restaurant" or "123 Main Street". This must be a place name,
        address, or category of establishments.**\
        **Any other types of input can generate errors and are not guaranteed to return valid results. The Google Places
        service will return candidate matches**\
        **based on this string and order the results based on their perceived relevance.**
    - Changed documentation of parameter places_name used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~\*Not Recommended\* A term to be matched against all content that Google has indexed for this place.
        Equivalent to \`keyword\`. The \`name\` field is no longer restricted to place names. Values in this field are
        combined with values in the keyword field and passed as part of the same search string. We recommend using only
        the \`keyword\` parameter for all search terms.~~\
        **Equivalent to \`keyword\`. Values in this field are combined with values in the \`keyword\` field and passed
        as part of the same search string.**
    - Changed documentation of parameter places_query used in 1 endpoints
    
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        ~~The text string on which to search, for example: "restaurant" or "123 Main Street". The Google Places service
        will return candidate matches based on this string and order the results based on their perceived relevance.~~\
        **The text string on which to search, for example: "restaurant" or "123 Main Street". This must a place name,
        address, or category of establishments. Any other types**\
        **of input can generate errors and are not guaranteed to return valid results. The Google Places service will
        return candidate matches based on this string and order
        the results based on their perceived relevance.**

Version 1.17.8 - PATCH
  - Changes
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* \`rankby=prominence\` (default): 50,000 meters~~\
        **\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rankby\` parameter.**\
        ~~\* \`rankby=distance\`: A few kilometers depending on density of area. \`radius\` will not be accepted, and
        will result in an INVALID_REQUEST.~~\
        **\* When using \`rankby=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.**

Version 1.17.7 - PATCH
  - BREAKING CHANGES
      - Removed operation GET /v1/snapToRoads
      - Removed operation GET /maps/api/distanceMatrix/json

  - Changes
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~A term to be matched against all content that Google has indexed for this place, including but not limited to
        name and type, as well as customer reviews and other third-party content. Note that explicitly including
        location information using this parameter may conflict with the location, radius, and rankby parameters, causing
        unexpected results.~~\
        **A term to be matched against all content that Google has indexed for this place, including but not limited to
        name and type, as well as customer reviews and other third-party content.**\
        **Explicitly including location information using this parameter may conflict with the location, radius, and
        rankby parameters, causing unexpected results.
    
        If this parameter is omitted, places with a business_status of CLOSED_TEMPORARILY or CLOSED_PERMANENTLY will not
        be returned.**

Version 1.17.6 - PATCH
  - Changes
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* \`rankby=distance\`: A few kilometers depending on density of area~~\
        **\* \`rankby=distance\`: A few kilometers depending on density of area. \`radius\` will not be accepted, and
        will result in an INVALID_REQUEST.**
    - Changed documentation of parameter places_rankby used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~- \`distance\`. This option biases search results in ascending order by their distance from the specified
        location. When \`distance\` is specified, one or more of \`keyword\`, \`name\`, or \`type\` is required.~~\
        **- \`distance\`. This option biases search results in ascending order by their distance from the specified
        location. When \`distance\` is specified, one or more of \`keyword\`, \`name\`, or \`type\` is required and
        \`radius\` is disallowed.**

Version 1.17.5 - PATCH
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        **<div class="caution"> Caution: Place Search requests and Place Details requests do not return the same fields.
        Place Search requests return a subset of the fields that are returned by Place Details requests. If the field
        you want is not returned by Place Search, you can use Place Search to get a <code>place_id</code>, then use that
        Place ID to make a Place Details request. For more information on the fields that are unavailable in a Place
        Search request, see <a
        href="https://developers.google.com/maps/documentation/places/web-service/place-data-fields\#places-api-fields-support">Places
        API fields support</a>.</div>**\
        ~~<div class="caution">Caution: Place Search requests and Place Details requests do not return the same fields.
        Place Search requests return a subset of the fields that are returned by Place Details requests. If the field
        you want is not returned by Place Search, you can use Place Search to get a place_id, then use that Place ID to
        make a Place Details request.</div>~~

Version 1.17.4 - PATCH
  - BREAKING CHANGES

  - Changes
    - Changed documentation of parameter mode used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        ~~\* \`DRIVING\` (default) indicates standard driving directions or distance using the road network.~~\
        **\* \`driving\` (default) indicates standard driving directions or distance using the road network.**\
        ~~\* \`WALKING\` requests walking directions or distance via pedestrian paths & sidewalks (where available).~~\
        **\* \`walking\` requests walking directions or distance via pedestrian paths & sidewalks (where available).**\
        ~~\* \`BICYCLING\` requests bicycling directions or distance via bicycle paths & preferred streets (where
        available).~~\
        **\* \`bicycling\` requests bicycling directions or distance via bicycle paths & preferred streets (where
        available).**\
        ~~\* \`TRANSIT\` requests directions or distance via public transit routes (where available). If you set the
        mode to transit, you can optionally specify either a \`departure_time\` or an \`arrival_time\`. If neither time
        is specified, the \`departure_time\` defaults to now (that is, the departure time defaults to the current time).
        You can also optionally include a \`transit_mode\` and/or a \`transit_routing_preference\`.~~\
        **\* \`transit\` requests directions or distance via public transit routes (where available). If you set the
        mode to transit, you can optionally specify either a \`departure_time\` or an \`arrival_time\`. If neither time
        is specified, the \`departure_time\` defaults to now (that is, the departure time defaults to the current time).
        You can also optionally include a \`transit_mode\` and/or a \`transit_routing_preference\`.**

Version 1.17.3 - PATCH
  - No changes

Version 1.17.2 - PATCH
  - No changes

Version 1.17.1 - PATCH
  - Changes
    - Changed documentation of parameter directions_waypoints used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. Learn more about billing for Google Maps Platform products.</div>~~\
        **<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about billing</a>
        for Google Maps Platform products.</div>**

Version 1.17.0 - MINOR
  - No changes

Version 1.16.35 - PATCH
  - Changes
    - Changed documentation of schema TravelMode used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        ~~- \`driving\` (default) indicates distance calculation using the road network.~~\
        **- \`DRIVING\` (default) indicates calculation using the road network.**\
        ~~- \`walking\` requests distance calculation for walking via pedestrian paths & sidewalks (where available).~~\
        **- \`BICYCLING\` requests calculation for bicycling via bicycle paths & preferred streets (where available).**\
        ~~- \`bicycling\` requests distance calculation for bicycling via bicycle paths & preferred streets (where
        available).~~\
        **- \`TRANSIT\` requests calculation via public transit routes (where available).**\
        ~~- \`transit\` requests distance calculation via public transit routes (where available).~~\
        **- \`WALKING\` requests calculation for walking via pedestrian paths & sidewalks (where available).**
    - Changed documentation of schema DirectionsTransitDetails used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        Additional information that is not relevant for other modes of transportation.

Version 1.16.34 - PATCH
  - Changes
    - Changed documentation of schema DirectionsStep used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        Each element in the steps array defines a single step of the calculated directions. A step is the most atomic
        unit of a direction's route, containing a single step describing a specific, single instruction on the journey.
        E.g. "Turn left at W. 4th St." The step not only describes the instruction but also contains distance and
        duration information relating to how this step relates to the following step. For example, a step denoted as
        "Merge onto I-80 West" may contain a duration of "37 miles" and "40 minutes," indicating that the next step is
        37 miles/40 minutes from this step.
    
        When using the Directions API to search for transit directions, the steps array will include additional transit
        details in the form of a transit_details array. If the directions include multiple modes of transportation,
        detailed directions will be provided for walking or driving steps in an inner steps array. For example, a
        walking step will include directions from the start and end locations: "Walk to Innes Ave & Fitch St". That step
        will include detailed walking directions for that route in the inner steps array, such as: "Head north-west",
        "Turn left onto Arelious Walker", and "Turn left onto Innes Ave".
    
    - Changed documentation of schema DirectionsRoute used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~Routes consist of nested Legs and Steps.~~\
        **Routes consist of nested \`legs\` and \`steps\`.**

Version 1.16.33 - PATCH
  - Changes
    - Changed documentation of parameter language used in 10 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Used in GET /maps/api/timezone/json
      - Used in GET /maps/api/distanceMatrix/json
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* If \`language\` is not supplied, the API attempts to use the preferred language as specified in the
        \`Accept-Language\` header, or the native language of the domain from which the request is sent.~~\
        **\* If \`language\` is not supplied, the API attempts to use the preferred language as specified in the
        \`Accept-Language\` header.**\
    
        \* The API does its best to provide a street address that is readable for both the user and locals. To achieve
        that goal, it returns street addresses in the local language, transliterated to a script readable by the user if
        necessary, observing the preferred language. All other addresses are returned in the preferred language. Address
        components are all returned in the same language, which is chosen from the first component.
        \* If a name is not available in the preferred language, the API uses the closest match.
        \* The preferred language has a small influence on the set of results that the API chooses to return, and the
        order in which they are returned. The geocoder interprets abbreviations differently depending on language, such
        as the abbreviations for street types, or synonyms that may be valid in one language but not in another. For
        example, _utca_ and _tér_ are synonyms for street in Hungarian.

Version 1.16.32 - PATCH
  - No changes

Version 1.16.31 - PATCH
  - BREAKING CHANGES
    - In operation GET /maps/api/directions/json
        - Removed parameter arrival_time
        - Removed parameter departure_time
        - Removed parameter alternatives
        - Removed parameter avoid
        - Removed parameter destination
        - Removed parameter origin
        - Removed parameter units
        - Removed parameter waypoints
        - Removed parameter traffic_model
        - Removed parameter transit_mode
        - Removed parameter transit_routing_preference
    - In operation GET /maps/api/elevation/json
        - Removed parameter locations
        - Removed parameter path
        - Removed parameter samples
    - In operation GET /maps/api/geocode/json
        - Removed parameter address
        - Removed parameter bounds
        - Removed parameter components
        - Removed parameter latlng
        - Removed parameter location_type
        - Removed parameter place_id
        - Removed parameter result_type
    - In operation GET /maps/api/timezone/json
        - Removed parameter location
        - Removed parameter timestamp
    - In operation GET /v1/snapToRoads
        - Removed parameter path
        - Removed parameter interpolate
    - In operation GET /v1/nearestRoads
        - Removed parameter points
    - In operation GET /maps/api/distanceMatrix/json
        - Removed parameter avoid
        - Removed parameter destinations
        - Removed parameter origins
        - Removed parameter units
    - In operation GET /maps/api/place/details/json
        - Removed parameter place_id
        - Removed parameter fields
        - Removed parameter sessiontoken
    - In operation GET /maps/api/place/findplacefromtext/json
        - Removed parameter inputtype
        - Removed parameter locationbias
    - In operation GET /maps/api/place/nearbysearch/json
        - Removed parameter keyword
        - Removed parameter location
        - Removed parameter name
        - Removed parameter rankby
    - In operation GET /maps/api/place/textsearch/json
        - Removed parameter location
        - Removed parameter maxprice
        - Removed parameter minprice
        - Removed parameter opennow
        - Removed parameter pagetoken
        - Removed parameter query
        - Removed parameter radius
        - Removed parameter type
    - In operation GET /maps/api/place/photo
        - Removed parameter photo_reference
        - Removed parameter maxheight
        - Removed parameter maxwidth
    - In operation GET /maps/api/place/autocomplete/json
        - Removed parameter components
        - Removed parameter strictbounds
        - Removed parameter offset
        - Removed parameter origin
        - Removed parameter location
        - Removed parameter types
    - In operation GET /maps/api/streetview
        - Removed parameter fov
        - Removed parameter heading
        - Removed parameter location
        - Removed parameter pano
        - Removed parameter pitch
        - Removed parameter radius
        - Removed parameter return_error_code
        - Removed parameter signature
        - Removed parameter size
        - Removed parameter source
    - In operation GET /maps/api/streetview/metadata
        - Removed parameter size

Version 1.16.30 - PATCH
  - No changes

Version 1.16.29 - PATCH
  - No changes

Version 1.16.28 - PATCH
  - No changes

Version 1.16.27 - PATCH
  - Changes
    - In operation GET /maps/api/place/nearbysearch/json
      - Changed documentation of parameter keyword
        - Changes:\
          ~~A term to be matched against all content that Google has indexed for this place, including but not limited
          to name, type, and address, as well as customer reviews and other third-party content.~~\
          **A term to be matched against all content that Google has indexed for this place, including but not limited
          to name and type, as well as customer reviews and other third-party content. Note that explicitly including
          location information using this parameter may conflict with the location, radius, and rankby parameters,
          causing unexpected results.**

Version 1.16.26 - PATCH
  - No changes

Version 1.16.25 - PATCH
  - No changes

Version 1.16.24 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter type
        - Changes:\
          ~~Restricts the results to places matching the specified type. Only one type may be specified (if more than
          one type is provided, all types following the first entry are ignored). See the list of [supported
          types](https://developers.google.com/maps/documentation/places/web-service/supported_types).~~\
          **Restricts the results to places matching the specified type. Only one type may be specified. If more than
          one type is provided, all types following the first entry are ignored.**\
          **\* \`type=hospital|pharmacy|doctor\` becomes \`type=hospital\`
          \* \`type=hospital,pharmacy,doctor\` is ignored entirely
      
          See the list of [supported
          types](https://developers.google.com/maps/documentation/places/web-service/supported_types).**

Version 1.16.23 - PATCH
  - Changes
    - In operation GET /maps/api/elevation/json
      - Changed documentation of parameter path
        - Changes:\
          ~~An array of comma separated {latitude,longitude} strings.~~\
          **An array of comma separated \`latitude,longitude\` strings.**

Version 1.16.22 - PATCH
  - No changes

Version 1.16.21 - PATCH
  - No changes

Version 1.16.20 - PATCH
  - No changes

Version 1.16.19 - PATCH
  - Changes
    - Changed documentation of schema Place used in 4 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        ~~Attributes descring a place. Not all attributes will be available for all place types.~~\
        **Attributes describing a place. Not all attributes will be available for all place types.**

Version 1.16.18 - PATCH
  - Changes
    - In operation GET /maps/api/geocode/json
      - Changed documentation of parameter address
        - Changes:\
          ~~<div class="note">Note: One of \`address\` or \`components\` is required.</div>~~\
          **<div class="note">Note: At least one of \`address\` or \`components\` is required.</div>**
      - Changed documentation of parameter components
        - Changes:\
          ~~A components filter with elements separated by a pipe (|). The components filter is also accepted as an
          optional parameter if an address is provided. Each element in the components filter consists of a
          component:value pair, and fully restricts the results from the geocoder.~~\
          **A components filter with elements separated by a pipe (|). The components filter is also accepted as an
          optional parameter if an address is provided. Each element in the components filter consists of a
          \`component:value\` pair, and fully restricts the results from the geocoder.**\
          ~~https://developers.google.com/maps/documentation/geocoding/overview\#component-filtering~~\
          **The components that can be filtered include:**\
          ~~<div class="note">Note: One of \`address\` or \`components\` is required.</div>~~\
          **\* \`postal_code\` matches \`postal_code\` and \`postal_code_prefix\`.
          \* \`country\` matches a country name or a two letter ISO 3166-1 country code. The API follows the ISO
          standard for defining countries, and the filtering works best when using the corresponding ISO code of the
          country.
            <aside class="note"><strong>Note</strong>: If you receive unexpected results with a country code, verify
          that you are using a code which includes the countries, dependent territories, and special areas of
          geographical interest you intend. You can find code information at Wikipedia: List of ISO 3166 country codes
          or the ISO Online Browsing Platform.</aside>
      
          The following components may be used to influence results, but will not be enforced:
      
          \* \`route\` matches the long or short name of a route.
          \* \`locality\` matches against \`locality\` and \`sublocality\` types.
          \* \`administrative_area\` matches all the \`administrative_area\` levels.
      
          Notes about component filtering:
      
          \* Do not repeat these component filters in requests, or the API will return \`INVALID_REQUEST\`:
            \* \`country\`
            \* \`postal_code\`
            \* \`route\`
          \* If the request contains repeated component filters, the API evaluates those filters as an AND, not an OR.
          \* Results are consistent with Google Maps, which occasionally yields unexpected \`ZERO_RESULTS\` responses.
          Using Place Autocomplete may provide better results in some use cases. To learn more, see [this
          FAQ](https://developers.devsite.corp.google.com/maps/documentation/geocoding/faq\#trbl_component_filtering).
          \* For each address component, either specify it in the address parameter or in a components filter, but not
          both. Specifying the same values in both may result in \`ZERO_RESULTS\`.
      
          <div class="note">Note: At least one of \`address\` or \`components\` is required.</div>**
    - Changed documentation of schema GeocodingStatus used in 1 endpoints
    
      - Used in GET /maps/api/geocode/json
      - Changes:\
        ~~- \`ZERO_RESULTS\` indicates that the geocode was successful but returned no results. This may occur if the
        geocoder was passed a non-existent address.~~\
        **- \`ZERO_RESULTS\` indicates that the geocode was successful but returned no results. This may occur if the
        geocoder was passed a non-existent address or a \`latlng\` in a remote location.**\
        ~~- \`INVALID_REQUEST\` generally indicates that the query (address, components or latlng) is missing.~~\
        **- \`INVALID_REQUEST\` generally indicates that the query (address, components, or latlng) is missing.**

Version 1.16.17 - PATCH
  - No changes

Version 1.16.16 - PATCH
  - No changes

Version 1.16.15 - PATCH
  - No changes

Version 1.16.14 - PATCH
  - Changes
    - In operation GET /maps/api/geocode/json
      - Changed documentation of parameter address
        - Changes:\
          The street address or plus code that you want to geocode. Specify addresses in accordance with the format used
          by the national postal service of the country concerned. Additional address elements such as business names
          and unit, suite or floor numbers should be avoided. Street address elements should be delimited by spaces
          (shown here as url-escaped to \`%20\`):
      
          \`\`\`
          address=24%20Sussex%20Drive%20Ottawa%20ON
          \`\`\`
      
          Format plus codes as shown here (plus signs are url-escaped to \`%2B\` and spaces are url-escaped to \`%20\`):
          - global code is a 4 character area code and 6 character or longer local code (\`849VCWC8+R9\` is
          \`849VCWC8%2BR9\`).
          - compound code is a 6 character or longer local code with an explicit location (\`CWC8+R9 Mountain View, CA,
          USA\` is \`CWC8%2BR9%20Mountain%20View%20CA%20USA\`).\
          **<div class="note">Note: One of \`address\` or \`components\` is required.</div>**
      - Changed documentation of parameter components
        - Changes:\
          A components filter with elements separated by a pipe (|). The components filter is also accepted as an
          optional parameter if an address is provided. Each element in the components filter consists of a
          component:value pair, and fully restricts the results from the geocoder.
      
          https://developers.google.com/maps/documentation/geocoding/overview\#component-filtering\
          **<div class="note">Note: One of \`address\` or \`components\` is required.</div>**
      - Changed documentation of parameter bounds
        - Changes:\
          ~~The bounding box of the viewport within which to bias geocode results more prominently. This parameter will
          only influence, not fully restrict, results from the geocoder.  - name: locations
          in: query~~\
          **The bounding box of the viewport within which to bias geocode results more prominently. This parameter will
          only influence, not fully restrict, results from the geocoder.**

Version 1.16.13 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter location
        - Changes:\
          ~~<div class="note">The \`location\` parameter may be overriden if the \`query\` contains an explicit location
          such as \`Market in Barcelona\`. Using quotes around the query may also influence the weight given to the
          \`location\` and \`radius\`.</div>~~\
          **<div class="note">The <code>location</code> parameter may be overriden if the <code>query</code> contains an
          explicit location such as <code>Market in Barcelona</code>. Using quotes around the query may also influence
          the weight given to the <code>location</code> and <code>radius</code>.</div>**

Version 1.16.12 - PATCH
  - No changes

Version 1.16.11 - PATCH
  - No changes

Version 1.16.10 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter location
        - Changes:\
          ~~The point around which to retrieve place information. This must be specified as \`latitude,longitude\`.~~\
          **The point around which to retrieve place information. This must be specified as \`latitude,longitude\`.**\
          **<div class="note">The \`location\` parameter may be overriden if the \`query\` contains an explicit location
          such as \`Market in Barcelona\`. Using quotes around the query may also influence the weight given to the
          \`location\` and \`radius\`.</div>**

Version 1.16.9 - PATCH
  - No changes

Version 1.16.8 - PATCH
  - No changes

Version 1.16.7 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter radius
        - Changes:\
          **The radius will automatically be clamped to a maximum value depending on the type of search and other
          parameters.
      
          \* Autocomplete: 50,000 meters
          \* Nearby Search:
            \* with \`keyword\` or \`name\`: 50,000 meters
            \* without \`keyword\` or \`name\`
              \* \`rankby=prominence\` (default): 50,000 meters
              \* \`rankby=distance\`: A few kilometers depending on density of area
          \* Query Autocomplete: 50,000 meters
          \* Text Search: 50,000 meters**

Version 1.16.6 - PATCH
  - No changes

Version 1.16.5 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter waypoints
        - Changes:\
          ~~<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. [Learn more
          about how Google Maps Platform products are
          billed.](https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced)</div>~~\
          **<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
          href="https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more
          about how Google Maps Platform products are billed.</a></div>**

Version 1.16.4 - PATCH
  - Changes
    - Changed documentation of schema Fare used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        The total fare for the route.\
        **\`\`\`
        {
          "currency" : "USD",
          "value" : 6,
          "text" : "$6.00"
        }
        \`\`\`**

Version 1.16.3 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter departure_time
        - Changes:\
          **<div class="note">Note: Distance Matrix requests specifying \`departure_time\` when \`mode=driving\` are
          limited to a maximum of 100 elements per request. The number of origins times the number of destinations
          defines the number of elements.</div>**

Version 1.16.2 - PATCH
  - No changes

Version 1.16.1 - PATCH
  - No changes

Version 1.16.0 - MINOR
  - Changes
    - In operation POST /geolocation/v1/geolocate
        - Changed documentation of response 200
        - Changes:\
          ~~Ok~~\
          **200 OK**
        - Changed documentation of response 400
        - Changes:\
          ~~Bad Request~~\
          **400 BAD REQUEST**
        - Changed documentation of response 404
        - Changes:\
          ~~Not Found~~\
          **404 NOT FOUND**
    - In operation GET /maps/api/directions/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/elevation/json
        - Changed documentation of response 200
        - Changes:\
          ~~Elevation Response~~\
          **200 OK**
    - In operation GET /maps/api/geocode/json
        - Changed documentation of response 200
        - Changes:\
          ~~Gecoding Response~~\
          **200 OK**
    - In operation GET /maps/api/timezone/json
        - Changed documentation of response 200
        - Changes:\
          ~~Time Zone Response~~\
          **200 OK**
    - In operation GET /v1/snapToRoads
        - Changed documentation of response 200
        - Changes:\
          ~~For each valid request, the Roads API will return a response in the format indicated within the request
          URL.~~\
          **200 OK**
    - In operation GET /v1/nearestRoads
        - Changed documentation of response 200
        - Changes:\
          ~~For each valid request, the Roads API will return a response in the format indicated within the request
          URL.~~\
          **200 OK**
        - Changed documentation of response 400
        - Changes:\
          ~~For each valid request, the Roads API will return a response in the format indicated within the request
          URL.~~\
          **400 BAD REQUEST**
    - In operation GET /maps/api/distanceMatrix/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/place/details/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/place/findplacefromtext/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Find Place From Text request.~~\
          **200 OK**
    - In operation GET /maps/api/place/nearbysearch/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/place/textsearch/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Places Text Search request.~~\
          **200 OK**
    - In operation GET /maps/api/place/photo
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Place Photo request.~~\
          **200 OK**
    - In operation GET /maps/api/place/queryautocomplete/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Autocomplete request.~~\
          **200 OK**
    - In operation GET /maps/api/place/autocomplete/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Autocomplete request.~~\
          **200 OK**
    - In operation GET /maps/api/streetview
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Street View Static request.~~\
          **200 OK**
    - In operation GET /maps/api/streetview/metadata
        - Changed documentation of response 200
        - Changes:\
          ~~Ok~~\
          **200 OK**

Version 1.15.0 - MINOR
  - Changes
    - Changed documentation of schema TimeZoneStatus used in 1 endpoints
    
      - Used in GET /maps/api/timezone/json
      - Changes:\
        ~~The \`status\` field within the Time Zone response object contains the status of the request. The "status"
        field may contain the following values:~~\
        **The \`status\` field within the Time Zone response object contains the status of the request. The \`status\`
        field may contain the following values:**

Version 1.14.5 - PATCH
  - Changes
    - Changed documentation of schema DirectionsStatus used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~TODO~~\
        **The status field within the Directions response object contains the status of the request, and may contain
        debugging information to help you track down why the Directions service failed. The status field may contain the
        following values:
    
        - \`OK\` indicates the response contains a valid result.
        - \`NOT_FOUND\` indicates at least one of the locations specified in the request's origin, destination, or
        waypoints could not be geocoded.
        - \`ZERO_RESULTS\` indicates no route could be found between the origin and destination.
        - \`MAX_WAYPOINTS_EXCEEDED\` indicates that too many waypoints were provided in the request. For applications
        using the Directions API as a web service, or the directions service in the Maps JavaScript API, the maximum
        allowed number of waypoints is 25, plus the origin and destination.
        - \`MAX_ROUTE_LENGTH_EXCEEDED\` indicates the requested route is too long and cannot be processed. This error
        occurs when more complex directions are returned. Try reducing the number of waypoints, turns, or instructions.
        - \`INVALID_REQUEST\` indicates that the provided request was invalid. Common causes of this status include an
        invalid parameter or parameter value.
        - \`OVER_DAILY_LIMIT\` indicates any of the following:
            - The API key is missing or invalid.
            - Billing has not been enabled on your account.
            - A self-imposed usage cap has been exceeded.
            - The provided method of payment is no longer valid (for example, a credit card has expired).
            See the [Maps FAQ](https://developers.google.com/maps/faq\#over-limit-key-error) to learn how to fix this.
        - \`OVER_QUERY_LIMIT\` indicates the service has received too many requests from your application within the
        allowed time period.
        - \`REQUEST_DENIED\` indicates that the service denied use of the directions service by your application.
        - \`UNKNOWN_ERROR\` indicates a directions request could not be processed due to a server error. The request may
        succeed if you try again.**

Version 1.14.4 - PATCH
  - No changes

Version 1.14.3 - PATCH
  - Changes
    - In operation GET /maps/api/place/details/json
      - Changed documentation of parameter place_id
        - Changes:\
          ~~A textual identifier that uniquelyidentifies a place, returned from a [Place
          Search](https://developers.google.com/maps/documentation/places/web-service/search).~~\
          **A textual identifier that uniquely identifies a place, returned from a [Place
          Search](https://developers.google.com/maps/documentation/places/web-service/search).**
      - Changed documentation of parameter fields
        - Changes:\
          ~~The Basic category includes the following fields: \`address_component\`, \`adr_address\`,
          \`business_status\`, \`formatted_address\`, \`geometry\`, \`icon\`, \`name\`, \`photo\`, \`place_id\`,
          \`plus_code\`, \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`.~~\
          **The Basic category includes the following fields: \`address_component\`, \`adr_address\`,
          \`business_status\`, \`formatted_address\`, \`geometry\`, \`icon\`, \`icon_mask_base_uri\`,
          \`icon_background_color\`, \`name\`, \`permanently_closed\`
          ([deprecated](https://developers.google.com/maps/deprecations)), \`photo\`, \`place_id\`, \`plus_code\`,
          \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`.**

Version 1.14.2 - PATCH
  - No changes

Version 1.14.1 - PATCH
  - No changes

Version 1.14.0 - MINOR
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
      
      - Changed documentation of parameter waypoints
        - Changes:\
          ~~Specifies an array of intermediate locations to include along the route between the origin and destination
          points as pass through or stopover locations. Waypoints alter a route by directing it through the specified
          location(s). The API supports waypoints for these travel modes: driving, walking and bicycling; not transit.
          You can specify waypoints using the following values:~~\
          **<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
          optimization, are billed at a higher rate. Learn more about billing for Google Maps Platform
          products.</div>**\
          ~~\* Place ID: The unique value specific to a location (\`ChIJGwVKWe5w44kRcr4b9E25-Go\`).~~\
          ~~\* Address string (\`Charlestown, Boston,MA\`)~~\
          **Specifies an array of intermediate locations to include along the route between the origin and destination
          points as pass through or stopover locations. Waypoints alter a route by directing it through the specified
          location(s). The API supports waypoints for these travel modes: driving, walking and bicycling; not transit.
          You can supply one or more locations separated by the pipe character (\`|\` or \`%7C\`), in the form of a
          place ID, an address, or latitude/longitude coordinates. By default, the Directions service calculates a route
          using the waypoints in the order they are given. The precedence for parsing the value of the waypoint is place
          ID, latitude/longitude coordinates, then address.**\
          ~~\* Latitude/longitude coordinates (lat/lng): an explicit value pair. (\`-34.92788%2C138.60008\` comma, no
          space)~~\
          **\* If you pass a place ID, you must prefix it with \`place_id:\`. You can retrieve place IDs from the
          Geocoding API and the Places API (including Place Autocomplete). For an example using place IDs from Place
          Autocomplete, see [Place Autocomplete and
          Directions](/maps/documentation/javascript/examples/places-autocomplete-directions). For more about place IDs,
          see the [Place ID overview](/maps/documentation/places/web-service/place-id).**\
          ~~\* Encoded polyline that can be specified by a set of any of the above. (\`enc:lexeF{\~wsZejrPjtye@:\`)~~\
          **<div class="note">For efficiency and accuracy, use place ID's when possible. These ID's are uniquely
          explicit like a lat/lng value pair and provide geocoding benefits for routing such as access points and
          traffic variables. Unlike an address, ID's do not require the service to perform a search or an intermediate
          request for place details; therefore, performance is better.</div>**\
          **\* If you pass latitude/longitude coordinates, the values go directly to the front-end server to calculate
          directions without geocoding. The points are snapped to roads and might not provide the accuracy your app
          needs. Use coordinates when you are confident the values truly specify the points your app needs for routing
          without regard to possible access points or additional geocoding details. Ensure that a comma (\`%2C\`) and
          not a space (\`%20\`) separates the latitude and longitude values.
          \* If you pass an address, the Directions service will geocode the string and convert it into
          latitude/longitude coordinates to calculate directions. If the address value is ambiguous, the value might
          evoke a search to disambiguate from similar addresses. For example, "1st Street" could be a complete value or
          a partial value for "1st street NE" or "1st St SE". This result may be different from that returned by the
          Geocoding API. You can avoid possible misinterpretations using place IDs.
          \* Alternatively, you can supply an encoded set of points using the [Encoded Polyline
          Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm). You will find an
          encoded set is useful for a large number of waypoints, because the URL is significantly shorter. All web
          services have a URL limit of 8192 characters.
            \* Encoded polylines must be prefixed with \`enc:\` and followed by a colon (\`:\`). For example:
          \`waypoints=enc:gfo}EtohhU:\`.
            \* You can also include multiple encoded polylines, separated by the pipe character (\`|\`). For example,
          \`waypoints=via:enc:wc\~oAwquwMdlTxiKtqLyiK:|enc:c\~vnAamswMvlTor@tjGi}L:| via:enc:udymA{\~bxM:\`
      
          \#\#\#\#\# Influence routes with stopover and pass through points
      
          For each waypoint in the request, the directions response appends an entry to the \`legs\` array to provide
          the details for stopovers on that leg of the journey.
      
          If you'd like to influence the route using waypoints without adding a stopover, add the prefix \`via:\` to the
          waypoint. Waypoints prefixed with \`via:\` will not add an entry to the \`legs\` array, but will route the
          journey through the waypoint.
      
          The following URL modifies the previous request such that the journey is routed through Lexington without
          stopping:
      
          \`\`\`
          https://maps.googleapis.com/maps/api/directions/json?
          origin=Boston,MA&destination=Concord,MA
          &waypoints=Charlestown,MA|via:Lexington,MA
          \`\`\`
      
          The \`via:\` prefix is most effective when creating routes in response to the user dragging the waypoints on
          the map. Doing so allows the user to see how the final route may look in real-time and helps ensure that
          waypoints are placed in locations that are accessible to the Directions API.
      
          <div class="caution">Caution: Using the \`via:\` prefix to avoid stopovers results in directions that are
          strict in their interpretation of the waypoint. This interpretation may result in severe detours on the route
          or \`ZERO_RESULTS\` in the response status code if the Directions API is unable to create directions through
          that point.</div>
      
      
          \#\#\#\#\# Optimize your waypoints
      
          By default, the Directions service calculates a route through the provided waypoints in their given order.
          Optionally, you may pass \`optimize:true\` as the first argument within the waypoints parameter to allow the
          Directions service to optimize the provided route by rearranging the waypoints in a more efficient order.
          (This optimization is an application of the traveling salesperson problem.) Travel time is the primary factor
          which is optimized, but other factors such as distance, number of turns and many more may be taken into
          account when deciding which route is the most efficient. All waypoints must be stopovers for the Directions
          service to optimize their route.
      
          If you instruct the Directions service to optimize the order of its waypoints, their order will be returned in
          the \`waypoint_order\` field within the routes object. The \`waypoint_order\` field returns values which are
          zero-based.
      
          The following example calculates a road journey from Adelaide, South Australia to each of South Australia's
          main wine regions using route optimization.
      
          \`\`\`
          https://maps.googleapis.com/maps/api/directions/json?
          origin=Adelaide,SA&destination=Adelaide,SA
          &waypoints=optimize:true|Barossa+Valley,SA|Clare,SA|Connawarra,SA|McLaren+Vale,SA
          \`\`\`
      
          Inspection of the calculated route will indicate that calculation uses waypoints in the following waypoint
          order:
      
          \`\`\`
          "waypoint_order": [ 3, 2, 0, 1 ]
          \`\`\`
      
          <div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. [Learn more
          about how Google Maps Platform products are
          billed.](https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced)</div>**
      - Changed documentation of parameter avoid
        - Changes:\
          **It's possible to request a route that avoids any combination of tolls, highways and ferries by passing
          multiple restrictions to the avoid parameter. For example:
      
          \`\`\`
          avoid=tolls|highways|ferries.
          \`\`\`**
      - Changed documentation of parameter units
        - Changes:\
          ~~Note: this unit system setting only affects the text displayed within distance fields. The distance fields
          also contain values which are always expressed in meters.~~\
          **<div class="note">Note: this unit system setting only affects the text displayed within distance fields. The
          distance fields also contain values which are always expressed in meters.</div>**
      - Changed documentation of parameter departure_time
        - Changes:\
          ~~Specifies the desired time of departure. You can specify the time as an integer in seconds since midnight,
          January 1, 1970 UTC. If a departure_time later than 9999-12-31T23:59:59.999999999Z is specified, the API will
          fall back the departure_time to 9999-12-31T23:59:59.999999999Z. Alternatively, you can specify a value of now,
          which sets the departure time to the current time (correct to the nearest second). The departure time may be
          specified in two cases:~~\
          **Specifies the desired time of departure. You can specify the time as an integer in seconds since midnight,
          January 1, 1970 UTC. If a \`departure_time\` later than 9999-12-31T23:59:59.999999999Z is specified, the API
          will fall back the \`departure_time\` to 9999-12-31T23:59:59.999999999Z. Alternatively, you can specify a
          value of now, which sets the departure time to the current time (correct to the nearest second). The departure
          time may be specified in two cases:**\
          ~~\* For requests where the travel mode is transit: You can optionally specify one of departure_time or
          arrival_time. If neither time is specified, the departure_time defaults to now (that is, the departure time
          defaults to the current time).~~\
          **\* For requests where the travel mode is transit: You can optionally specify one of \`departure_time\` or
          \`arrival_time\`. If neither time is specified, the \`departure_time\` defaults to now (that is, the departure
          time defaults to the current time).**\
          ~~\* For requests where the travel mode is driving: You can specify the departure_time to receive a route and
          trip duration (response field: duration_in_traffic) that take traffic conditions into account. The
          departure_time must be set to the current time or some time in the future. It cannot be in the past.~~\
          **\* For requests where the travel mode is driving: You can specify the \`departure_time\` to receive a route
          and trip duration (response field: duration_in_traffic) that take traffic conditions into account. The
          \`departure_time\` must be set to the current time or some time in the future. It cannot be in the past.**\
          ~~Note: If departure time is not specified, choice of route and duration are based on road network and average
          time-independent traffic conditions. Results for a given request may vary over time due to changes in the road
          network, updated average traffic conditions, and the distributed nature of the service. Results may also vary
          between nearly-equivalent routes at any time or frequency.~~\
          **<div class="note">Note: If departure time is not specified, choice of route and duration are based on road
          network and average time-independent traffic conditions. Results for a given request may vary over time due to
          changes in the road network, updated average traffic conditions, and the distributed nature of the service.
          Results may also vary between nearly-equivalent routes at any time or frequency.</div>**
      - Changed documentation of parameter traffic_model
        - Changes:\
          ~~Specifies the assumptions to use when calculating time in traffic. This setting affects the value returned
          in the duration_in_traffic field in the response, which contains the predicted time in traffic based on
          historical averages. The traffic_model parameter may only be specified for driving directions where the
          request includes a departure_time. The available values for this parameter are:~~\
          **Specifies the assumptions to use when calculating time in traffic. This setting affects the value returned
          in the duration_in_traffic field in the response, which contains the predicted time in traffic based on
          historical averages. The \`traffic_model\` parameter may only be specified for driving directions where the
          request includes a \`departure_time\`. The available values for this parameter are:**\
          ~~\* \`best_guess\` (default) indicates that the returned duration_in_traffic should be the best estimate of
          travel time given what is known about both historical traffic conditions and live traffic. Live traffic
          becomes more important the closer the departure_time is to now.~~\
          **\* \`best_guess\` (default) indicates that the returned duration_in_traffic should be the best estimate of
          travel time given what is known about both historical traffic conditions and live traffic. Live traffic
          becomes more important the closer the \`departure_time\` is to now.**
    - In operation GET /maps/api/elevation/json
      - Changed documentation of parameter locations
        - Changes:\
          ~~- An array of coordinates separated using the pipe ('|') character:
          \`locations=40.714728,-73.998672|-34.397,150.644\`~~\
          **- An array of coordinates separated using the pipe ('|') character:**\
          ~~- A set of encoded coordinates using the [Encoded Polyline
          Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm):
          \`locations=enc:gfo}EtohhU\`~~\
          **\`\`\`**\
          **locations=40.714728,-73.998672|-34.397,150.644**\
          **\`\`\`
          - A set of encoded coordinates using the [Encoded Polyline
          Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm):
            \`\`\`
            locations=enc:gfo}EtohhU
            \`\`\`**
    - Changed documentation of operation GET /maps/api/geocode/json
      - Changes:\
        ~~To see countries currently supported by the Google Maps Platform Geocoding API, please consult the [Google
        Maps coverage data](https://developers.google.com/maps/coverage). The accuracy of geocoded locations may vary
        per country, so you should consider using the returned location_type field to determine if a good enough match
        has been found for the purposes of your application. Please note that the availability of geocoding data depends
        on our contracts with data providers, so it is subject to change.~~\
        **To see countries currently supported by the Google Maps Platform Geocoding API, please consult the [Google
        Maps coverage data](https://developers.google.com/maps/coverage). The accuracy of geocoded locations may vary
        per country, so you should consider using the returned \`location_type\` field to determine if a good enough
        match has been found for the purposes of your application. Please note that the availability of geocoding data
        depends on our contracts with data providers, so it is subject to change.**
    - In operation GET /maps/api/geocode/json
      - Changed documentation of parameter address
        - Changes:\
          ~~\`address=24%20Sussex%20Drive%20Ottawa%20ON\`~~\
          **\`\`\`**\
          **address=24%20Sussex%20Drive%20Ottawa%20ON**\
          **\`\`\`**\
          Format plus codes as shown here (plus signs are url-escaped to \`%2B\` and spaces are url-escaped to \`%20\`):
          - global code is a 4 character area code and 6 character or longer local code (\`849VCWC8+R9\` is
          \`849VCWC8%2BR9\`).
          - compound code is a 6 character or longer local code with an explicit location (\`CWC8+R9 Mountain View, CA,
          USA\` is \`CWC8%2BR9%20Mountain%20View%20CA%20USA\`).
    - In operation GET /v1/snapToRoads
      - Changed documentation of parameter path
        - Changes:\
          ~~Note: The snapping algorithm works best for points that are not too far apart. If you observe odd snapping
          behavior, try creating paths that have points closer together. To ensure the best snap-to-road quality, you
          should aim to provide paths on which consecutive pairs of points are within 300m of each other. This will also
          help in handling any isolated, long jumps between consecutive points caused by GPS signal loss, or noise.~~\
          **<div class="note">Note: The snapping algorithm works best for points that are not too far apart. If you
          observe odd snapping behavior, try creating paths that have points closer together. To ensure the best
          snap-to-road quality, you should aim to provide paths on which consecutive pairs of points are within 300m of
          each other. This will also help in handling any isolated, long jumps between consecutive points caused by GPS
          signal loss, or noise.</div>**
    - In operation GET /v1/nearestRoads
      - Changed documentation of parameter points
        - Changes:\
          ~~Note: The snapping algorithm works best for points that are not too far apart. If you observe odd snapping
          behavior, try creating paths that have points closer together. To ensure the best snap-to-road quality, you
          should aim to provide paths on which consecutive pairs of points are within 300m of each other. This will also
          help in handling any isolated, long jumps between consecutive points caused by GPS signal loss, or noise.~~\
          **<div class="note">Note: The snapping algorithm works best for points that are not too far apart. If you
          observe odd snapping behavior, try creating paths that have points closer together. To ensure the best
          snap-to-road quality, you should aim to provide paths on which consecutive pairs of points are within 300m of
          each other. This will also help in handling any isolated, long jumps between consecutive points caused by GPS
          signal loss, or noise.</div>**
    - In operation GET /maps/api/distanceMatrix/json
      - Changed documentation of parameter origins
        - Changes:\
          ~~Note: using place IDs is preferred over using addresses or latitude/longitude coordinates. Using coordinates
          will always result in the point being snapped to the road nearest to those coordinates - which may not be an
          access point to the property, or even a road that will quickly or safely lead to the destination.~~\
          **<div class="note">Note: using place IDs is preferred over using addresses or latitude/longitude coordinates.
          Using coordinates will always result in the point being snapped to the road nearest to those coordinates -
          which may not be an access point to the property, or even a road that will quickly or safely lead to the
          destination.</div>**\
          ~~- You can also include multiple encoded polylines, separated by the pipe character \`|\`. For example:
          \`origins=enc:wc\~oAwquwMdlTxiKtqLyiK:|enc:c\~vnAamswMvlTor@tjGi}L:|enc:udymA{\~bxM:\`~~\
          **- You can also include multiple encoded polylines, separated by the pipe character \`|\`. For example:**\
          **\`\`\`
              origins=enc:wc\~oAwquwMdlTxiKtqLyiK:|enc:c\~vnAamswMvlTor@tjGi}L:|enc:udymA{\~bxM:
              \`\`\`**
    - Changed documentation of parameter mode used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        ~~For the calculation of distances and directions, you may specify the transportation mode to use. By default,
        \`DRIVING\` mode is used.~~\
        **For the calculation of distances and directions, you may specify the transportation mode to use. By default,
        \`DRIVING\` mode is used. By default, directions are calculated as driving directions. The following travel
        modes are supported:
    
        \* \`DRIVING\` (default) indicates standard driving directions or distance using the road network.
        \* \`WALKING\` requests walking directions or distance via pedestrian paths & sidewalks (where available).
        \* \`BICYCLING\` requests bicycling directions or distance via bicycle paths & preferred streets (where
        available).
        \* \`TRANSIT\` requests directions or distance via public transit routes (where available). If you set the mode
        to transit, you can optionally specify either a \`departure_time\` or an \`arrival_time\`. If neither time is
        specified, the \`departure_time\` defaults to now (that is, the departure time defaults to the current time).
        You can also optionally include a \`transit_mode\` and/or a \`transit_routing_preference\`.
    
        <div class="note">Note: Both walking and bicycling directions may sometimes not include clear pedestrian or
        bicycling paths, so these directions will return warnings in the returned result which you must display to the
        user.</div>**
    - Changed documentation of schema Bounds used in 6 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        A rectangle in geographical coordinates from points at the southwest and northeast corners.
    - Changed documentation of schema Geometry used in 4 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        An object describing the location.

Version 1.10.5 - PATCH
  - No changes

Version 1.10.4 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
          ~~\* Place IDs must be prefixed with place_id:. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see [Place
          Autocomplete and
          Directions](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions).
          For more about place IDs, see the [Place ID
          overview](https://developers.google.com/maps/documentation/places/web-service/place-id).~~\
          **\* Place IDs must be prefixed with \`place_id:\`. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see [Place
          Autocomplete and
          Directions](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions).
          For more about place IDs, see the [Place ID
          overview](https://developers.google.com/maps/documentation/places/web-service/place-id).**\
          ~~\`origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE\` For efficiency and accuracy, use place ID's when possible.
          These ID's are uniquely explicit like a lat/lng value pair and provide geocoding benefits for routing such as
          access points and traffic variables. Unlike an address, ID's do not require the service to perform a search or
          an intermediate request for place details; therefore, performance is better.~~\
          **_(newline)_**\
          **\`\`\`
            origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE
            \`\`\`**\
          ~~\`origin=24+Sussex+Drive+Ottawa+ON\`~~\
          **_(newline)_**\
          **\`\`\`
            origin=24+Sussex+Drive+Ottawa+ON
            \`\`\`**\
          ~~\`origin=41.43206,-81.38992\`~~\
          **_(newline)_**\
          ~~\* Plus codes must be formatted as a global code or a compound code. Format plus codes as shown here (plus
          signs are url-escaped to %2B and spaces are url-escaped to %20). Global code is a 4 character area code and 6
          character or longer local code (849VCWC8+R9 is 849VCWC8%2BR9). Compound code is a 6 character or longer local
          code with an explicit location (CWC8+R9 Mountain View, CA, USA is CWC8%2BR9%20Mountain%20View%20CA%20USA).~~\
          **\`\`\`**\
          **origin=41.43206,-81.38992
            \`\`\`
      
          \* Plus codes must be formatted as a global code or a compound code. Format plus codes as shown here (plus
          signs are url-escaped to \`%2B\` and spaces are url-escaped to \`%20\`).
      
            \* \*\*Global code\*\* is a 4 character area code and 6 character or longer local code (849VCWC8+R9 is
          \`849VCWC8%2BR9\`).
            \* \*\*Compound code\*\* is a 6 character or longer local code with an explicit location (CWC8+R9 Mountain
          View, CA, USA is \`CWC8%2BR9%20Mountain%20View%20CA%20USA\`).
      
          <div class="note">Note: For efficiency and accuracy, use place ID's when possible. These ID's are uniquely
          explicit like a lat/lng value pair and provide geocoding benefits for routing such as access points and
          traffic variables. Unlike an address, ID's do not require the service to perform a search or an intermediate
          request for place details; therefore, performance is better.</div>**
      - Changed documentation of parameter waypoints
        - Changes:\
          ~~\* Place ID: The unique value specific to a location (ChIJGwVKWe5w44kRcr4b9E25-Go).~~\
          **\* Place ID: The unique value specific to a location (\`ChIJGwVKWe5w44kRcr4b9E25-Go\`).**\
          ~~\* Address string (Charlestown, Boston,MA)~~\
          **\* Address string (\`Charlestown, Boston,MA\`)**\
          ~~\* Latitude/longitude coordinates (lat/lng): an explicit value pair. (-34.92788%2C138.60008 comma, no
          space)~~\
          **\* Latitude/longitude coordinates (lat/lng): an explicit value pair. (\`-34.92788%2C138.60008\` comma, no
          space)**\
          ~~\* Encoded polyline that can be specified by a set of any of the above. (enc:lexeF{\~wsZejrPjtye@:)~~\
          **\* Encoded polyline that can be specified by a set of any of the above. (\`enc:lexeF{\~wsZejrPjtye@:\`)**
      - Changed documentation of parameter alternatives
        - Changes:\
          ~~If set to true, specifies that the Directions service may provide more than one route alternative in the
          response. Note that providing route alternatives may increase the response time from the server. This is only
          available for requests without intermediate waypoints.~~\
          **If set to \`true\`, specifies that the Directions service may provide more than one route alternative in the
          response. Note that providing route alternatives may increase the response time from the server. This is only
          available for requests without intermediate waypoints. For more information, see the [guide to
          waypoints](https://developers.google.com/maps/documentation/directions/get-directions\#Waypoints).**

Version 1.10.3 - PATCH
  - No changes

Version 1.10.2 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
          ~~The place ID, address, or textual latitude/longitude value from which you wish to calculate directions/~~\
          **The place ID, address, or textual latitude/longitude value from which you wish to calculate directions.**

Version 1.10.1 - PATCH
  - No changes

Version 1.10.0 - MINOR
  - BREAKING CHANGES
    - In operation GET /maps/api/directions/json
        - Removed parameter mode
    - In operation GET /maps/api/distanceMatrix/json
        - Removed parameter mode

  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
          ~~\* Place IDs must be prefixed with place_id:. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see Place
          Autocomplete and Directions. For more about place IDs, see the Place ID overview.~~\
          **\* Place IDs must be prefixed with place_id:. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see [Place
          Autocomplete and
          Directions](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions).
          For more about place IDs, see the [Place ID
          overview](https://developers.google.com/maps/documentation/places/web-service/place-id).**\
          ~~\`origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE\`~~\
          **\`origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE\` For efficiency and accuracy, use place ID's when possible.
          These ID's are uniquely explicit like a lat/lng value pair and provide geocoding benefits for routing such as
          access points and traffic variables. Unlike an address, ID's do not require the service to perform a search or
          an intermediate request for place details; therefore, performance is better.**

Version 1.9.0 - MINOR
  - Changes
    - Changed documentation of parameter language used in 3 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Used in GET /maps/api/timezone/json
      - Changes:\
        ~~https://developers.google.com/maps/faq\#languagesupport~~\
        **\* See the [list of supported languages](https://developers.google.com/maps/faq\#languagesupport). Google
        often updates the supported languages, so this list may not be exhaustive.
        \* If \`language\` is not supplied, the API attempts to use the preferred language as specified in the
        \`Accept-Language\` header, or the native language of the domain from which the request is sent.
        \* The API does its best to provide a street address that is readable for both the user and locals. To achieve
        that goal, it returns street addresses in the local language, transliterated to a script readable by the user if
        necessary, observing the preferred language. All other addresses are returned in the preferred language. Address
        components are all returned in the same language, which is chosen from the first component.
        \* If a name is not available in the preferred language, the API uses the closest match.
        \* The preferred language has a small influence on the set of results that the API chooses to return, and the
        order in which they are returned. The geocoder interprets abbreviations differently depending on language, such
        as the abbreviations for street types, or synonyms that may be valid in one language but not in another. For
        example, _utca_ and _tér_ are synonyms for street in Hungarian.**
    - Changed documentation of parameter region used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Changes:\
        ~~The region code, specified as a ccTLD ("top-level domain") two-character value.
    
        https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains\#Country_code_top-level_domains~~\
        **The region code, specified as a [ccTLD ("top-level
        domain")](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains\#Country_code_top-level_domains)
        two-character value. Most ccTLD codes are identical to ISO 3166-1 codes, with some notable exceptions. For
        example, the United Kingdom's ccTLD is "uk" (.co.uk) while its ISO 3166-1 code is "gb" (technically for the
        entity of "The United Kingdom of Great Britain and Northern Ireland").**

Version 1.8.1 - PATCH
  - Changes
    - Changed documentation of schema ElevationStatus used in 1 endpoints
    
      - Used in GET /maps/api/elevation/json
      - Changes:\
        **- \`DATA_NOT_AVAILABLE\` indicating that there's no available data for the input locations.**

Version 1.8.0 - MINOR
  - No changes

Version 1.7.1 - PATCH
  - No changes

Version 1.7.0 - MINOR
  - No changes

Version 1.6.0 - MINOR
  - No changes

Version 1.5.3 - PATCH
  - No changes

Version 1.5.2 - PATCH
  - No changes

```

</details>

<details>
  <summary>Markdown</summary>

Version 1.22.3 - PATCH
  - No changes

Version 1.22.2 - PATCH
  - Changes
    - Changed documentation of parameter nearestroads_points used in 1 endpoints
    
      - Used in GET /v1/nearestRoads
      - Changes:\
        ~~The path to be snapped. The path parameter accepts a list of latitude/longitude pairs. Latitude and longitude
        values should be separated by commas. Coordinates should be separated by the pipe character: "|". For example:
        \`path=60.170880,24.942795|60.170879,24.942796|60.170877,24.942796\`.~~\
        **The points to be snapped. The points parameter accepts a list of latitude/longitude pairs. Separate latitude
        and longitude values with commas. Separate coordinates with the pipe character: "|". For example:
        \`points=60.170880,24.942795|60.170879,24.942796|60.170877,24.942796\`.**\
        ~~<div class="note">Note: The snapping algorithm works best for points that are not too far apart. If you
        observe odd snapping behavior, try creating paths that have points closer together. To ensure the best
        snap-to-road quality, you should aim to provide paths on which consecutive pairs of points are within 300m of
        each other. This will also help in handling any isolated, long jumps between consecutive points caused by GPS
        signal loss, or noise.</div>~~

Version 1.22.1 - PATCH
  - Changes
    - Changed documentation of operation GET /v1/nearestRoads
      - Changes:\
        ~~This service returns individual road segments for a given set of GPS coordinates. This services takes up to
        100 GPS points and returns the closest road segment for each point. The points passed do not need to be part of
        a continuous path.~~\
        **This service returns individual road segments for a given set of GPS coordinates. This services takes up to
        100 GPS points and returns the closest road segments for each point. The points passed do not need to be part of
        a continuous path.**

Version 1.22.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Basic category includes the following fields: \`address_component\`, \`adr_address\`, \`business_status\`,
        \`formatted_address\`, \`geometry\`, \`icon\`, \`icon_mask_base_uri\`, \`icon_background_color\`, \`name\`,
        \`permanently_closed\` ([deprecated](https://developers.google.com/maps/deprecations)), \`photo\`, \`place_id\`,
        \`plus_code\`, \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`.~~\
        **The Basic category includes the following fields: \`address_component\`, \`adr_address\`, \`business_status\`,
        \`formatted_address\`, \`geometry\`, \`icon\`, \`icon_mask_base_uri\`, \`icon_background_color\`, \`name\`,
        \`permanently_closed\` ([deprecated](https://developers.google.com/maps/deprecations)), \`photo\`, \`place_id\`,
        \`plus_code\`, \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`, \`wheelchair_accessible_entrance\`.**\
        ~~The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`reviews\`, \`takeout\`, \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`reservable\`, \`reviews\`, \`serves_beer\`,
        \`serves_breakfast\`, \`serves_brunch\`, \`serves_dinner\`, \`serves_lunch\`, \`serves_vegetarian_food\`,
        \`serves_wine\`, \`takeout\`, \`user_ratings_total\`.**

Version 1.21.1 - PATCH
  - No changes

Version 1.21.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Contact category includes the following fields: \`formatted_phone_number\`,
        \`international_phone_number\`, \`opening_hours\`, \`website\`~~\
        **The Contact category includes the following fields: \`current_opening_hours\`, \`formatted_phone_number\`,
        \`international_phone_number\`, \`opening_hours\`, \`secondary_opening_hours\`, \`website\`**\
        ~~The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`reviews\`, \`takeout\`, \`user_ratings_total\`.**

Version 1.20.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`editorial_summary\`, \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.**\
        ~~<aside class="note"><strong>Note: </strong><code>curbside_pickup</code>, <code>delivery</code>,
        <code>dine_in</code>, and <code>takeout</code> are only supported for Place Details requests.
        </aside>~~

Version 1.19.1 - PATCH
  - Changes
    - Changed documentation of parameter places_reviewnotranslation used in 1 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Changes:\
        ~~Specify \`reviews_no_translations=true\` to enable translation of reviews; specify
        \`reviews_no_translations=false\` to disable translation of reviews. Reviews are returned in their original
        language.~~\
        **Specify \`reviews_no_translations=true\` to disable translation of reviews; specify
        \`reviews_no_translations=false\` to enable translation of reviews. Reviews are returned in their original
        language.**\
        ~~If omitted, translation of reviews is enabled. If the \`language\` parameter was specified in the request, use
        the specified language as the preferred language for translation. If \`language\` is omitted, the API attempts
        to use the \`Accept-Language\` header as the preferred language.~~\
        **If omitted, or passed with no value, translation of reviews is enabled. If the \`language\` parameter was
        specified in the request, use the specified language as the preferred language for translation. If \`language\`
        is omitted, the API attempts to use the \`Accept-Language\` header as the preferred language.**

Version 1.19.0 - MINOR
  - No changes

Version 1.18.0 - MINOR
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        ~~The Atmosphere category includes the following fields: \`price_level\`, \`rating\`, \`review\`,
        \`user_ratings_total\`.~~\
        **The Atmosphere category includes the following fields: \`curbside_pickup\`, \`delivery\`, \`dine_in\`,
        \`price_level\`, \`rating\`, \`review\`, \`takeout\`, \`user_ratings_total\`.**\
        **<aside class="note"><strong>Note: </strong><code>curbside_pickup</code>, <code>delivery</code>,
        <code>dine_in</code>, and <code>takeout</code> are only supported for Place Details requests.
        </aside>**

Version 1.17.17 - PATCH
  - Changes
    - Changed documentation of parameter places_location used in 1 endpoints
    
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~The point around which to retrieve place information. This must be specified as \`latitude,longitude\`.~~\
        **The point around which to retrieve place information. This must be specified as \`latitude,longitude\`. The
        \`radius\` parameter must also be provided when specifying a location. If \`radius\` is not provided, the
        \`location\` parameter is ignored.**

Version 1.17.16 - PATCH
  - No changes

Version 1.17.15 - PATCH
  - Changes
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~Explicitly including location information using this parameter may conflict with the location, radius, and
        rank_by parameters, causing unexpected results.~~\
        **Explicitly including location information using this parameter may conflict with the location, radius, and
        rankby parameters, causing unexpected results.**
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rank_by\` parameter.~~\
        **\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rankby\` parameter.**\
        ~~\* When using \`rank_by=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.~~\
        **\* When using \`rankby=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.**

Version 1.17.14 - PATCH
  - No changes

Version 1.17.13 - PATCH
  - No changes

Version 1.17.12 - PATCH
  - Changes
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~Explicitly including location information using this parameter may conflict with the location, radius, and
        rankby parameters, causing unexpected results.~~\
        **Explicitly including location information using this parameter may conflict with the location, radius, and
        rank_by parameters, causing unexpected results.**
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rankby\` parameter.~~\
        **\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rank_by\` parameter.**\
        ~~\* When using \`rankby=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.~~\
        **\* When using \`rank_by=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.**

Version 1.17.11 - PATCH
  - Changes
    - Changed documentation of parameter directions_waypoints used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about billing</a>
        for Google Maps Platform products.</div>~~\
        **<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing-and-pricing/pricing\#directions-advanced">Learn more about
        billing</a> for Google Maps Platform products.</div>**\
        ~~<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers..google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about how Google
        Maps Platform products are billed.</a></div>~~\
        **<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing-and-pricing/pricing\#directions-advanced">Learn more about how
        Google Maps Platform products are billed.</a></div>**
    - Changed documentation of parameter distancematrix_origins used in 1 endpoints
    
      - Used in GET /maps/api/distancematrix/json
      - Changes:\
        ~~<div class="note">Note: using place IDs is preferred over using addresses or latitude/longitude coordinates.
        Using coordinates will always result in the point being snapped to the road nearest to those coordinates - which
        may not be an access point to the property, or even a road that will quickly or safely lead to the
        destination.</div>~~\
        **<div class="note">Note: using place IDs is preferred over using addresses or latitude/longitude coordinates.
        Using coordinates will always result in the point being snapped to the road nearest to those coordinates - which
        may not be an access point to the property, or even a road that will quickly or safely lead to the destination.
        Using the address will provide the distance to the center of the building, as opposed to an entrance to the
        building.</div>**

Version 1.17.10 - PATCH
  - Changes
    - Changed documentation of parameter directions_waypoints used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about
        how Google Maps Platform products are billed.</a></div>~~\
        **<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
        href="https://developers..google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about how Google
        Maps Platform products are billed.</a></div>**
    - Changed documentation of parameter geocode_components used in 1 endpoints
    
      - Used in GET /maps/api/geocode/json
      - Changes:\
        ~~\* Results are consistent with Google Maps, which occasionally yields unexpected \`ZERO_RESULTS\` responses.
        Using Place Autocomplete may provide better results in some use cases. To learn more, see [this
        FAQ](https://developers.devsite.corp.google.com/maps/documentation/geocoding/faq\#trbl_component_filtering).~~\
        **\* Results are consistent with Google Maps, which occasionally yields unexpected \`ZERO_RESULTS\` responses.
        Using Place Autocomplete may provide better results in some use cases. To learn more, see [this
        FAQ](https://developers..google.com/maps/documentation/geocoding/faq\#trbl_component_filtering).**\
    
        \* For each address component, either specify it in the address parameter or in a components filter, but not
        both. Specifying the same values in both may result in \`ZERO_RESULTS\`.
    
        <div class="note">Note: At least one of \`address\` or \`components\` is required.</div>
    - Changed documentation of parameter places_types used in 1 endpoints
    
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~You may restrict results from a Place Autocomplete request to be of a certain type by passing a types
        parameter. The parameter specifies a type or a type collection, as listed in the supported types below. If
        nothing is specified, all types are returned. In general only a single type is allowed. The exception is that
        you can safely mix the geocode and establishment types, but note that this will have the same effect as
        specifying no types. The supported types are:~~\
        **You can restrict results from a Place Autocomplete request to be of a certain type by passing the \`types\`
        parameter. This parameter specifies a type or a type collection, as listed in [Place
        Types](/maps/documentation/places/web-service/supported_types). If nothing is specified, all types are
        returned.**\
        ~~- \`geocode\` instructs the Place Autocomplete service to return only geocoding results, rather than business
        results. Generally, you use this request to disambiguate results where the location specified may be
        indeterminate.~~\
        ~~- \`address\` instructs the Place Autocomplete service to return only geocoding results with a precise
        address. Generally, you use this request when you know the user will be looking for a fully specified
        address.~~\
        **For the value of the \`types\` parameter you can specify either:**\
        ~~- \`establishment\` instructs the Place Autocomplete service to return only business results.~~\
        **\* Up to five values from [Table 1](/maps/documentation/places/web-service/supported_types\#table1) or [Table
        2](/maps/documentation/places/web-service/supported_types\#table2). For multiple values, separate each value
        with a \`|\` (vertical bar). For example:**\
        ~~- \`(regions)\` type collection instructs the Places service to return any result matching the following
        types:~~\
        ~~- \`locality\`~~\
        **\`types=book_store|cafe\`**\
        ~~- \`sublocality\`~~\
        ~~- \`postal_code\`~~\
        **\* Any supported filter in [Table 3](/maps/documentation/places/web-service/supported_types\#table3). You can
        safely mix the \`geocode\` and \`establishment\` types. You cannot mix type collections (\`address\`,
        \`(cities)\` or \`(regions)\`) with any other type, or an error occurs.**\
        ~~- \`country\`~~\
        ~~- \`administrative_area_level_1\`~~\
        **The request will be rejected with an \`INVALID_REQUEST\` error if:**\
        ~~- \`administrative_area_level_2\`~~\
        ~~- \`(cities)\` type collection instructs the Places service to return results that match \`locality\` or
        \`administrative_area_level_3\`.~~\
        **\* More than five types are specified.**\
        **\* Any unrecognized types are present.
        \* Any types from in [Table 1](/maps/documentation/places/web-service/supported_types\#table1) or [Table
        2](/maps/documentation/places/web-service/supported_types\#table2) are mixed with any of the filters in [Table
        3](/maps/documentation/places/web-service/supported_types\#table3).**

Version 1.17.9 - PATCH
  - Changes
    - In operation GET /maps/api/place/findplacefromtext/json
      - Changed documentation of parameter input
        - Changes:\
          ~~Text input that identifies the search target, such as a name, address, or phone number. The input must be a
          string. Non-string input such as a lat/lng coordinate or plus code generates an error.~~\
          **The text string on which to search, for example: "restaurant" or "123 Main Street". This must be a place
          name, address, or category of establishments. Any other types of input can generate errors**\
          **and are not guaranteed to return valid results. The Places API will return candidate matches based on this
          string and order the results based on their perceived relevance.**
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~A term to be matched against all content that Google has indexed for this place, including but not limited to
        name and type, as well as customer reviews and other third-party content.~~\
        **The text string on which to search, for example: "restaurant" or "123 Main Street". This must be a place name,
        address, or category of establishments.**\
        **Any other types of input can generate errors and are not guaranteed to return valid results. The Google Places
        service will return candidate matches**\
        **based on this string and order the results based on their perceived relevance.**
    - Changed documentation of parameter places_name used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~\*Not Recommended\* A term to be matched against all content that Google has indexed for this place.
        Equivalent to \`keyword\`. The \`name\` field is no longer restricted to place names. Values in this field are
        combined with values in the keyword field and passed as part of the same search string. We recommend using only
        the \`keyword\` parameter for all search terms.~~\
        **Equivalent to \`keyword\`. Values in this field are combined with values in the \`keyword\` field and passed
        as part of the same search string.**
    - Changed documentation of parameter places_query used in 1 endpoints
    
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        ~~The text string on which to search, for example: "restaurant" or "123 Main Street". The Google Places service
        will return candidate matches based on this string and order the results based on their perceived relevance.~~\
        **The text string on which to search, for example: "restaurant" or "123 Main Street". This must a place name,
        address, or category of establishments. Any other types**\
        **of input can generate errors and are not guaranteed to return valid results. The Google Places service will
        return candidate matches based on this string and order
        the results based on their perceived relevance.**

Version 1.17.8 - PATCH
  - Changes
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* \`rankby=prominence\` (default): 50,000 meters~~\
        **\* Up to 50,000 meters, adjusted dynamically based on area density, independent of \`rankby\` parameter.**\
        ~~\* \`rankby=distance\`: A few kilometers depending on density of area. \`radius\` will not be accepted, and
        will result in an INVALID_REQUEST.~~\
        **\* When using \`rankby=distance\`, the radius parameter will not be accepted, and will result in an
        \`INVALID_REQUEST\`.**

Version 1.17.7 - PATCH
  - BREAKING CHANGES
      - Removed operation GET /v1/snapToRoads
      - Removed operation GET /maps/api/distanceMatrix/json

  - Changes
    - Changed documentation of parameter places_keyword used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~A term to be matched against all content that Google has indexed for this place, including but not limited to
        name and type, as well as customer reviews and other third-party content. Note that explicitly including
        location information using this parameter may conflict with the location, radius, and rankby parameters, causing
        unexpected results.~~\
        **A term to be matched against all content that Google has indexed for this place, including but not limited to
        name and type, as well as customer reviews and other third-party content.**\
        **Explicitly including location information using this parameter may conflict with the location, radius, and
        rankby parameters, causing unexpected results.
    
        If this parameter is omitted, places with a business_status of CLOSED_TEMPORARILY or CLOSED_PERMANENTLY will not
        be returned.**

Version 1.17.6 - PATCH
  - Changes
    - Changed documentation of parameter places_radius used in 4 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* \`rankby=distance\`: A few kilometers depending on density of area~~\
        **\* \`rankby=distance\`: A few kilometers depending on density of area. \`radius\` will not be accepted, and
        will result in an INVALID_REQUEST.**
    - Changed documentation of parameter places_rankby used in 1 endpoints
    
      - Used in GET /maps/api/place/nearbysearch/json
      - Changes:\
        ~~- \`distance\`. This option biases search results in ascending order by their distance from the specified
        location. When \`distance\` is specified, one or more of \`keyword\`, \`name\`, or \`type\` is required.~~\
        **- \`distance\`. This option biases search results in ascending order by their distance from the specified
        location. When \`distance\` is specified, one or more of \`keyword\`, \`name\`, or \`type\` is required and
        \`radius\` is disallowed.**

Version 1.17.5 - PATCH
  - Changes
    - Changed documentation of parameter places_fields used in 2 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Changes:\
        **<div class="caution"> Caution: Place Search requests and Place Details requests do not return the same fields.
        Place Search requests return a subset of the fields that are returned by Place Details requests. If the field
        you want is not returned by Place Search, you can use Place Search to get a <code>place_id</code>, then use that
        Place ID to make a Place Details request. For more information on the fields that are unavailable in a Place
        Search request, see <a
        href="https://developers.google.com/maps/documentation/places/web-service/place-data-fields\#places-api-fields-support">Places
        API fields support</a>.</div>**\
        ~~<div class="caution">Caution: Place Search requests and Place Details requests do not return the same fields.
        Place Search requests return a subset of the fields that are returned by Place Details requests. If the field
        you want is not returned by Place Search, you can use Place Search to get a place_id, then use that Place ID to
        make a Place Details request.</div>~~

Version 1.17.4 - PATCH
  - BREAKING CHANGES

  - Changes
    - Changed documentation of parameter mode used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        ~~\* \`DRIVING\` (default) indicates standard driving directions or distance using the road network.~~\
        **\* \`driving\` (default) indicates standard driving directions or distance using the road network.**\
        ~~\* \`WALKING\` requests walking directions or distance via pedestrian paths & sidewalks (where available).~~\
        **\* \`walking\` requests walking directions or distance via pedestrian paths & sidewalks (where available).**\
        ~~\* \`BICYCLING\` requests bicycling directions or distance via bicycle paths & preferred streets (where
        available).~~\
        **\* \`bicycling\` requests bicycling directions or distance via bicycle paths & preferred streets (where
        available).**\
        ~~\* \`TRANSIT\` requests directions or distance via public transit routes (where available). If you set the
        mode to transit, you can optionally specify either a \`departure_time\` or an \`arrival_time\`. If neither time
        is specified, the \`departure_time\` defaults to now (that is, the departure time defaults to the current time).
        You can also optionally include a \`transit_mode\` and/or a \`transit_routing_preference\`.~~\
        **\* \`transit\` requests directions or distance via public transit routes (where available). If you set the
        mode to transit, you can optionally specify either a \`departure_time\` or an \`arrival_time\`. If neither time
        is specified, the \`departure_time\` defaults to now (that is, the departure time defaults to the current time).
        You can also optionally include a \`transit_mode\` and/or a \`transit_routing_preference\`.**

Version 1.17.3 - PATCH
  - No changes

Version 1.17.2 - PATCH
  - No changes

Version 1.17.1 - PATCH
  - Changes
    - Changed documentation of parameter directions_waypoints used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. Learn more about billing for Google Maps Platform products.</div>~~\
        **<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
        optimization, are billed at a higher rate. <a
        href="https://developers.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more about billing</a>
        for Google Maps Platform products.</div>**

Version 1.17.0 - MINOR
  - No changes

Version 1.16.35 - PATCH
  - Changes
    - Changed documentation of schema TravelMode used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        ~~- \`driving\` (default) indicates distance calculation using the road network.~~\
        **- \`DRIVING\` (default) indicates calculation using the road network.**\
        ~~- \`walking\` requests distance calculation for walking via pedestrian paths & sidewalks (where available).~~\
        **- \`BICYCLING\` requests calculation for bicycling via bicycle paths & preferred streets (where available).**\
        ~~- \`bicycling\` requests distance calculation for bicycling via bicycle paths & preferred streets (where
        available).~~\
        **- \`TRANSIT\` requests calculation via public transit routes (where available).**\
        ~~- \`transit\` requests distance calculation via public transit routes (where available).~~\
        **- \`WALKING\` requests calculation for walking via pedestrian paths & sidewalks (where available).**
    - Changed documentation of schema DirectionsTransitDetails used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        Additional information that is not relevant for other modes of transportation.

Version 1.16.34 - PATCH
  - Changes
    - Changed documentation of schema DirectionsStep used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        Each element in the steps array defines a single step of the calculated directions. A step is the most atomic
        unit of a direction's route, containing a single step describing a specific, single instruction on the journey.
        E.g. "Turn left at W. 4th St." The step not only describes the instruction but also contains distance and
        duration information relating to how this step relates to the following step. For example, a step denoted as
        "Merge onto I-80 West" may contain a duration of "37 miles" and "40 minutes," indicating that the next step is
        37 miles/40 minutes from this step.
    
        When using the Directions API to search for transit directions, the steps array will include additional transit
        details in the form of a transit_details array. If the directions include multiple modes of transportation,
        detailed directions will be provided for walking or driving steps in an inner steps array. For example, a
        walking step will include directions from the start and end locations: "Walk to Innes Ave & Fitch St". That step
        will include detailed walking directions for that route in the inner steps array, such as: "Head north-west",
        "Turn left onto Arelious Walker", and "Turn left onto Innes Ave".
    
    - Changed documentation of schema DirectionsRoute used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~Routes consist of nested Legs and Steps.~~\
        **Routes consist of nested \`legs\` and \`steps\`.**

Version 1.16.33 - PATCH
  - Changes
    - Changed documentation of parameter language used in 10 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Used in GET /maps/api/timezone/json
      - Used in GET /maps/api/distanceMatrix/json
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Used in GET /maps/api/place/queryautocomplete/json
      - Used in GET /maps/api/place/autocomplete/json
      - Changes:\
        ~~\* If \`language\` is not supplied, the API attempts to use the preferred language as specified in the
        \`Accept-Language\` header, or the native language of the domain from which the request is sent.~~\
        **\* If \`language\` is not supplied, the API attempts to use the preferred language as specified in the
        \`Accept-Language\` header.**\
    
        \* The API does its best to provide a street address that is readable for both the user and locals. To achieve
        that goal, it returns street addresses in the local language, transliterated to a script readable by the user if
        necessary, observing the preferred language. All other addresses are returned in the preferred language. Address
        components are all returned in the same language, which is chosen from the first component.
        \* If a name is not available in the preferred language, the API uses the closest match.
        \* The preferred language has a small influence on the set of results that the API chooses to return, and the
        order in which they are returned. The geocoder interprets abbreviations differently depending on language, such
        as the abbreviations for street types, or synonyms that may be valid in one language but not in another. For
        example, _utca_ and _tér_ are synonyms for street in Hungarian.

Version 1.16.32 - PATCH
  - No changes

Version 1.16.31 - PATCH
  - BREAKING CHANGES
    - In operation GET /maps/api/directions/json
        - Removed parameter arrival_time
        - Removed parameter departure_time
        - Removed parameter alternatives
        - Removed parameter avoid
        - Removed parameter destination
        - Removed parameter origin
        - Removed parameter units
        - Removed parameter waypoints
        - Removed parameter traffic_model
        - Removed parameter transit_mode
        - Removed parameter transit_routing_preference
    - In operation GET /maps/api/elevation/json
        - Removed parameter locations
        - Removed parameter path
        - Removed parameter samples
    - In operation GET /maps/api/geocode/json
        - Removed parameter address
        - Removed parameter bounds
        - Removed parameter components
        - Removed parameter latlng
        - Removed parameter location_type
        - Removed parameter place_id
        - Removed parameter result_type
    - In operation GET /maps/api/timezone/json
        - Removed parameter location
        - Removed parameter timestamp
    - In operation GET /v1/snapToRoads
        - Removed parameter path
        - Removed parameter interpolate
    - In operation GET /v1/nearestRoads
        - Removed parameter points
    - In operation GET /maps/api/distanceMatrix/json
        - Removed parameter avoid
        - Removed parameter destinations
        - Removed parameter origins
        - Removed parameter units
    - In operation GET /maps/api/place/details/json
        - Removed parameter place_id
        - Removed parameter fields
        - Removed parameter sessiontoken
    - In operation GET /maps/api/place/findplacefromtext/json
        - Removed parameter inputtype
        - Removed parameter locationbias
    - In operation GET /maps/api/place/nearbysearch/json
        - Removed parameter keyword
        - Removed parameter location
        - Removed parameter name
        - Removed parameter rankby
    - In operation GET /maps/api/place/textsearch/json
        - Removed parameter location
        - Removed parameter maxprice
        - Removed parameter minprice
        - Removed parameter opennow
        - Removed parameter pagetoken
        - Removed parameter query
        - Removed parameter radius
        - Removed parameter type
    - In operation GET /maps/api/place/photo
        - Removed parameter photo_reference
        - Removed parameter maxheight
        - Removed parameter maxwidth
    - In operation GET /maps/api/place/autocomplete/json
        - Removed parameter components
        - Removed parameter strictbounds
        - Removed parameter offset
        - Removed parameter origin
        - Removed parameter location
        - Removed parameter types
    - In operation GET /maps/api/streetview
        - Removed parameter fov
        - Removed parameter heading
        - Removed parameter location
        - Removed parameter pano
        - Removed parameter pitch
        - Removed parameter radius
        - Removed parameter return_error_code
        - Removed parameter signature
        - Removed parameter size
        - Removed parameter source
    - In operation GET /maps/api/streetview/metadata
        - Removed parameter size

Version 1.16.30 - PATCH
  - No changes

Version 1.16.29 - PATCH
  - No changes

Version 1.16.28 - PATCH
  - No changes

Version 1.16.27 - PATCH
  - Changes
    - In operation GET /maps/api/place/nearbysearch/json
      - Changed documentation of parameter keyword
        - Changes:\
          ~~A term to be matched against all content that Google has indexed for this place, including but not limited
          to name, type, and address, as well as customer reviews and other third-party content.~~\
          **A term to be matched against all content that Google has indexed for this place, including but not limited
          to name and type, as well as customer reviews and other third-party content. Note that explicitly including
          location information using this parameter may conflict with the location, radius, and rankby parameters,
          causing unexpected results.**

Version 1.16.26 - PATCH
  - No changes

Version 1.16.25 - PATCH
  - No changes

Version 1.16.24 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter type
        - Changes:\
          ~~Restricts the results to places matching the specified type. Only one type may be specified (if more than
          one type is provided, all types following the first entry are ignored). See the list of [supported
          types](https://developers.google.com/maps/documentation/places/web-service/supported_types).~~\
          **Restricts the results to places matching the specified type. Only one type may be specified. If more than
          one type is provided, all types following the first entry are ignored.**\
          **\* \`type=hospital|pharmacy|doctor\` becomes \`type=hospital\`
          \* \`type=hospital,pharmacy,doctor\` is ignored entirely
      
          See the list of [supported
          types](https://developers.google.com/maps/documentation/places/web-service/supported_types).**

Version 1.16.23 - PATCH
  - Changes
    - In operation GET /maps/api/elevation/json
      - Changed documentation of parameter path
        - Changes:\
          ~~An array of comma separated {latitude,longitude} strings.~~\
          **An array of comma separated \`latitude,longitude\` strings.**

Version 1.16.22 - PATCH
  - No changes

Version 1.16.21 - PATCH
  - No changes

Version 1.16.20 - PATCH
  - No changes

Version 1.16.19 - PATCH
  - Changes
    - Changed documentation of schema Place used in 4 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        ~~Attributes descring a place. Not all attributes will be available for all place types.~~\
        **Attributes describing a place. Not all attributes will be available for all place types.**

Version 1.16.18 - PATCH
  - Changes
    - In operation GET /maps/api/geocode/json
      - Changed documentation of parameter address
        - Changes:\
          ~~<div class="note">Note: One of \`address\` or \`components\` is required.</div>~~\
          **<div class="note">Note: At least one of \`address\` or \`components\` is required.</div>**
      - Changed documentation of parameter components
        - Changes:\
          ~~A components filter with elements separated by a pipe (|). The components filter is also accepted as an
          optional parameter if an address is provided. Each element in the components filter consists of a
          component:value pair, and fully restricts the results from the geocoder.~~\
          **A components filter with elements separated by a pipe (|). The components filter is also accepted as an
          optional parameter if an address is provided. Each element in the components filter consists of a
          \`component:value\` pair, and fully restricts the results from the geocoder.**\
          ~~https://developers.google.com/maps/documentation/geocoding/overview\#component-filtering~~\
          **The components that can be filtered include:**\
          ~~<div class="note">Note: One of \`address\` or \`components\` is required.</div>~~\
          **\* \`postal_code\` matches \`postal_code\` and \`postal_code_prefix\`.
          \* \`country\` matches a country name or a two letter ISO 3166-1 country code. The API follows the ISO
          standard for defining countries, and the filtering works best when using the corresponding ISO code of the
          country.
            <aside class="note"><strong>Note</strong>: If you receive unexpected results with a country code, verify
          that you are using a code which includes the countries, dependent territories, and special areas of
          geographical interest you intend. You can find code information at Wikipedia: List of ISO 3166 country codes
          or the ISO Online Browsing Platform.</aside>
      
          The following components may be used to influence results, but will not be enforced:
      
          \* \`route\` matches the long or short name of a route.
          \* \`locality\` matches against \`locality\` and \`sublocality\` types.
          \* \`administrative_area\` matches all the \`administrative_area\` levels.
      
          Notes about component filtering:
      
          \* Do not repeat these component filters in requests, or the API will return \`INVALID_REQUEST\`:
            \* \`country\`
            \* \`postal_code\`
            \* \`route\`
          \* If the request contains repeated component filters, the API evaluates those filters as an AND, not an OR.
          \* Results are consistent with Google Maps, which occasionally yields unexpected \`ZERO_RESULTS\` responses.
          Using Place Autocomplete may provide better results in some use cases. To learn more, see [this
          FAQ](https://developers.devsite.corp.google.com/maps/documentation/geocoding/faq\#trbl_component_filtering).
          \* For each address component, either specify it in the address parameter or in a components filter, but not
          both. Specifying the same values in both may result in \`ZERO_RESULTS\`.
      
          <div class="note">Note: At least one of \`address\` or \`components\` is required.</div>**
    - Changed documentation of schema GeocodingStatus used in 1 endpoints
    
      - Used in GET /maps/api/geocode/json
      - Changes:\
        ~~- \`ZERO_RESULTS\` indicates that the geocode was successful but returned no results. This may occur if the
        geocoder was passed a non-existent address.~~\
        **- \`ZERO_RESULTS\` indicates that the geocode was successful but returned no results. This may occur if the
        geocoder was passed a non-existent address or a \`latlng\` in a remote location.**\
        ~~- \`INVALID_REQUEST\` generally indicates that the query (address, components or latlng) is missing.~~\
        **- \`INVALID_REQUEST\` generally indicates that the query (address, components, or latlng) is missing.**

Version 1.16.17 - PATCH
  - No changes

Version 1.16.16 - PATCH
  - No changes

Version 1.16.15 - PATCH
  - No changes

Version 1.16.14 - PATCH
  - Changes
    - In operation GET /maps/api/geocode/json
      - Changed documentation of parameter address
        - Changes:\
          The street address or plus code that you want to geocode. Specify addresses in accordance with the format used
          by the national postal service of the country concerned. Additional address elements such as business names
          and unit, suite or floor numbers should be avoided. Street address elements should be delimited by spaces
          (shown here as url-escaped to \`%20\`):
      
          \`\`\`
          address=24%20Sussex%20Drive%20Ottawa%20ON
          \`\`\`
      
          Format plus codes as shown here (plus signs are url-escaped to \`%2B\` and spaces are url-escaped to \`%20\`):
          - global code is a 4 character area code and 6 character or longer local code (\`849VCWC8+R9\` is
          \`849VCWC8%2BR9\`).
          - compound code is a 6 character or longer local code with an explicit location (\`CWC8+R9 Mountain View, CA,
          USA\` is \`CWC8%2BR9%20Mountain%20View%20CA%20USA\`).\
          **<div class="note">Note: One of \`address\` or \`components\` is required.</div>**
      - Changed documentation of parameter components
        - Changes:\
          A components filter with elements separated by a pipe (|). The components filter is also accepted as an
          optional parameter if an address is provided. Each element in the components filter consists of a
          component:value pair, and fully restricts the results from the geocoder.
      
          https://developers.google.com/maps/documentation/geocoding/overview\#component-filtering\
          **<div class="note">Note: One of \`address\` or \`components\` is required.</div>**
      - Changed documentation of parameter bounds
        - Changes:\
          ~~The bounding box of the viewport within which to bias geocode results more prominently. This parameter will
          only influence, not fully restrict, results from the geocoder.  - name: locations
          in: query~~\
          **The bounding box of the viewport within which to bias geocode results more prominently. This parameter will
          only influence, not fully restrict, results from the geocoder.**

Version 1.16.13 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter location
        - Changes:\
          ~~<div class="note">The \`location\` parameter may be overriden if the \`query\` contains an explicit location
          such as \`Market in Barcelona\`. Using quotes around the query may also influence the weight given to the
          \`location\` and \`radius\`.</div>~~\
          **<div class="note">The <code>location</code> parameter may be overriden if the <code>query</code> contains an
          explicit location such as <code>Market in Barcelona</code>. Using quotes around the query may also influence
          the weight given to the <code>location</code> and <code>radius</code>.</div>**

Version 1.16.12 - PATCH
  - No changes

Version 1.16.11 - PATCH
  - No changes

Version 1.16.10 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter location
        - Changes:\
          ~~The point around which to retrieve place information. This must be specified as \`latitude,longitude\`.~~\
          **The point around which to retrieve place information. This must be specified as \`latitude,longitude\`.**\
          **<div class="note">The \`location\` parameter may be overriden if the \`query\` contains an explicit location
          such as \`Market in Barcelona\`. Using quotes around the query may also influence the weight given to the
          \`location\` and \`radius\`.</div>**

Version 1.16.9 - PATCH
  - No changes

Version 1.16.8 - PATCH
  - No changes

Version 1.16.7 - PATCH
  - Changes
    - In operation GET /maps/api/place/textsearch/json
      - Changed documentation of parameter radius
        - Changes:\
          **The radius will automatically be clamped to a maximum value depending on the type of search and other
          parameters.
      
          \* Autocomplete: 50,000 meters
          \* Nearby Search:
            \* with \`keyword\` or \`name\`: 50,000 meters
            \* without \`keyword\` or \`name\`
              \* \`rankby=prominence\` (default): 50,000 meters
              \* \`rankby=distance\`: A few kilometers depending on density of area
          \* Query Autocomplete: 50,000 meters
          \* Text Search: 50,000 meters**

Version 1.16.6 - PATCH
  - No changes

Version 1.16.5 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter waypoints
        - Changes:\
          ~~<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. [Learn more
          about how Google Maps Platform products are
          billed.](https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced)</div>~~\
          **<div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. <a
          href="https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced">Learn more
          about how Google Maps Platform products are billed.</a></div>**

Version 1.16.4 - PATCH
  - Changes
    - Changed documentation of schema Fare used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        The total fare for the route.\
        **\`\`\`
        {
          "currency" : "USD",
          "value" : 6,
          "text" : "$6.00"
        }
        \`\`\`**

Version 1.16.3 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter departure_time
        - Changes:\
          **<div class="note">Note: Distance Matrix requests specifying \`departure_time\` when \`mode=driving\` are
          limited to a maximum of 100 elements per request. The number of origins times the number of destinations
          defines the number of elements.</div>**

Version 1.16.2 - PATCH
  - No changes

Version 1.16.1 - PATCH
  - No changes

Version 1.16.0 - MINOR
  - Changes
    - In operation POST /geolocation/v1/geolocate
        - Changed documentation of response 200
        - Changes:\
          ~~Ok~~\
          **200 OK**
        - Changed documentation of response 400
        - Changes:\
          ~~Bad Request~~\
          **400 BAD REQUEST**
        - Changed documentation of response 404
        - Changes:\
          ~~Not Found~~\
          **404 NOT FOUND**
    - In operation GET /maps/api/directions/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/elevation/json
        - Changed documentation of response 200
        - Changes:\
          ~~Elevation Response~~\
          **200 OK**
    - In operation GET /maps/api/geocode/json
        - Changed documentation of response 200
        - Changes:\
          ~~Gecoding Response~~\
          **200 OK**
    - In operation GET /maps/api/timezone/json
        - Changed documentation of response 200
        - Changes:\
          ~~Time Zone Response~~\
          **200 OK**
    - In operation GET /v1/snapToRoads
        - Changed documentation of response 200
        - Changes:\
          ~~For each valid request, the Roads API will return a response in the format indicated within the request
          URL.~~\
          **200 OK**
    - In operation GET /v1/nearestRoads
        - Changed documentation of response 200
        - Changes:\
          ~~For each valid request, the Roads API will return a response in the format indicated within the request
          URL.~~\
          **200 OK**
        - Changed documentation of response 400
        - Changes:\
          ~~For each valid request, the Roads API will return a response in the format indicated within the request
          URL.~~\
          **400 BAD REQUEST**
    - In operation GET /maps/api/distanceMatrix/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/place/details/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/place/findplacefromtext/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Find Place From Text request.~~\
          **200 OK**
    - In operation GET /maps/api/place/nearbysearch/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Distance Matrix API query.~~\
          **200 OK**
    - In operation GET /maps/api/place/textsearch/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Places Text Search request.~~\
          **200 OK**
    - In operation GET /maps/api/place/photo
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Place Photo request.~~\
          **200 OK**
    - In operation GET /maps/api/place/queryautocomplete/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Autocomplete request.~~\
          **200 OK**
    - In operation GET /maps/api/place/autocomplete/json
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Autocomplete request.~~\
          **200 OK**
    - In operation GET /maps/api/streetview
        - Changed documentation of response 200
        - Changes:\
          ~~Response for the Street View Static request.~~\
          **200 OK**
    - In operation GET /maps/api/streetview/metadata
        - Changed documentation of response 200
        - Changes:\
          ~~Ok~~\
          **200 OK**

Version 1.15.0 - MINOR
  - Changes
    - Changed documentation of schema TimeZoneStatus used in 1 endpoints
    
      - Used in GET /maps/api/timezone/json
      - Changes:\
        ~~The \`status\` field within the Time Zone response object contains the status of the request. The "status"
        field may contain the following values:~~\
        **The \`status\` field within the Time Zone response object contains the status of the request. The \`status\`
        field may contain the following values:**

Version 1.14.5 - PATCH
  - Changes
    - Changed documentation of schema DirectionsStatus used in 1 endpoints
    
      - Used in GET /maps/api/directions/json
      - Changes:\
        ~~TODO~~\
        **The status field within the Directions response object contains the status of the request, and may contain
        debugging information to help you track down why the Directions service failed. The status field may contain the
        following values:
    
        - \`OK\` indicates the response contains a valid result.
        - \`NOT_FOUND\` indicates at least one of the locations specified in the request's origin, destination, or
        waypoints could not be geocoded.
        - \`ZERO_RESULTS\` indicates no route could be found between the origin and destination.
        - \`MAX_WAYPOINTS_EXCEEDED\` indicates that too many waypoints were provided in the request. For applications
        using the Directions API as a web service, or the directions service in the Maps JavaScript API, the maximum
        allowed number of waypoints is 25, plus the origin and destination.
        - \`MAX_ROUTE_LENGTH_EXCEEDED\` indicates the requested route is too long and cannot be processed. This error
        occurs when more complex directions are returned. Try reducing the number of waypoints, turns, or instructions.
        - \`INVALID_REQUEST\` indicates that the provided request was invalid. Common causes of this status include an
        invalid parameter or parameter value.
        - \`OVER_DAILY_LIMIT\` indicates any of the following:
            - The API key is missing or invalid.
            - Billing has not been enabled on your account.
            - A self-imposed usage cap has been exceeded.
            - The provided method of payment is no longer valid (for example, a credit card has expired).
            See the [Maps FAQ](https://developers.google.com/maps/faq\#over-limit-key-error) to learn how to fix this.
        - \`OVER_QUERY_LIMIT\` indicates the service has received too many requests from your application within the
        allowed time period.
        - \`REQUEST_DENIED\` indicates that the service denied use of the directions service by your application.
        - \`UNKNOWN_ERROR\` indicates a directions request could not be processed due to a server error. The request may
        succeed if you try again.**

Version 1.14.4 - PATCH
  - No changes

Version 1.14.3 - PATCH
  - Changes
    - In operation GET /maps/api/place/details/json
      - Changed documentation of parameter place_id
        - Changes:\
          ~~A textual identifier that uniquelyidentifies a place, returned from a [Place
          Search](https://developers.google.com/maps/documentation/places/web-service/search).~~\
          **A textual identifier that uniquely identifies a place, returned from a [Place
          Search](https://developers.google.com/maps/documentation/places/web-service/search).**
      - Changed documentation of parameter fields
        - Changes:\
          ~~The Basic category includes the following fields: \`address_component\`, \`adr_address\`,
          \`business_status\`, \`formatted_address\`, \`geometry\`, \`icon\`, \`name\`, \`photo\`, \`place_id\`,
          \`plus_code\`, \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`.~~\
          **The Basic category includes the following fields: \`address_component\`, \`adr_address\`,
          \`business_status\`, \`formatted_address\`, \`geometry\`, \`icon\`, \`icon_mask_base_uri\`,
          \`icon_background_color\`, \`name\`, \`permanently_closed\`
          ([deprecated](https://developers.google.com/maps/deprecations)), \`photo\`, \`place_id\`, \`plus_code\`,
          \`type\`, \`url\`, \`utc_offset\`, \`vicinity\`.**

Version 1.14.2 - PATCH
  - No changes

Version 1.14.1 - PATCH
  - No changes

Version 1.14.0 - MINOR
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
      
      - Changed documentation of parameter waypoints
        - Changes:\
          ~~Specifies an array of intermediate locations to include along the route between the origin and destination
          points as pass through or stopover locations. Waypoints alter a route by directing it through the specified
          location(s). The API supports waypoints for these travel modes: driving, walking and bicycling; not transit.
          You can specify waypoints using the following values:~~\
          **<div class="caution">Caution: Requests using more than 10 waypoints (between 11 and 25), or waypoint
          optimization, are billed at a higher rate. Learn more about billing for Google Maps Platform
          products.</div>**\
          ~~\* Place ID: The unique value specific to a location (\`ChIJGwVKWe5w44kRcr4b9E25-Go\`).~~\
          ~~\* Address string (\`Charlestown, Boston,MA\`)~~\
          **Specifies an array of intermediate locations to include along the route between the origin and destination
          points as pass through or stopover locations. Waypoints alter a route by directing it through the specified
          location(s). The API supports waypoints for these travel modes: driving, walking and bicycling; not transit.
          You can supply one or more locations separated by the pipe character (\`|\` or \`%7C\`), in the form of a
          place ID, an address, or latitude/longitude coordinates. By default, the Directions service calculates a route
          using the waypoints in the order they are given. The precedence for parsing the value of the waypoint is place
          ID, latitude/longitude coordinates, then address.**\
          ~~\* Latitude/longitude coordinates (lat/lng): an explicit value pair. (\`-34.92788%2C138.60008\` comma, no
          space)~~\
          **\* If you pass a place ID, you must prefix it with \`place_id:\`. You can retrieve place IDs from the
          Geocoding API and the Places API (including Place Autocomplete). For an example using place IDs from Place
          Autocomplete, see [Place Autocomplete and
          Directions](/maps/documentation/javascript/examples/places-autocomplete-directions). For more about place IDs,
          see the [Place ID overview](/maps/documentation/places/web-service/place-id).**\
          ~~\* Encoded polyline that can be specified by a set of any of the above. (\`enc:lexeF{\~wsZejrPjtye@:\`)~~\
          **<div class="note">For efficiency and accuracy, use place ID's when possible. These ID's are uniquely
          explicit like a lat/lng value pair and provide geocoding benefits for routing such as access points and
          traffic variables. Unlike an address, ID's do not require the service to perform a search or an intermediate
          request for place details; therefore, performance is better.</div>**\
          **\* If you pass latitude/longitude coordinates, the values go directly to the front-end server to calculate
          directions without geocoding. The points are snapped to roads and might not provide the accuracy your app
          needs. Use coordinates when you are confident the values truly specify the points your app needs for routing
          without regard to possible access points or additional geocoding details. Ensure that a comma (\`%2C\`) and
          not a space (\`%20\`) separates the latitude and longitude values.
          \* If you pass an address, the Directions service will geocode the string and convert it into
          latitude/longitude coordinates to calculate directions. If the address value is ambiguous, the value might
          evoke a search to disambiguate from similar addresses. For example, "1st Street" could be a complete value or
          a partial value for "1st street NE" or "1st St SE". This result may be different from that returned by the
          Geocoding API. You can avoid possible misinterpretations using place IDs.
          \* Alternatively, you can supply an encoded set of points using the [Encoded Polyline
          Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm). You will find an
          encoded set is useful for a large number of waypoints, because the URL is significantly shorter. All web
          services have a URL limit of 8192 characters.
            \* Encoded polylines must be prefixed with \`enc:\` and followed by a colon (\`:\`). For example:
          \`waypoints=enc:gfo}EtohhU:\`.
            \* You can also include multiple encoded polylines, separated by the pipe character (\`|\`). For example,
          \`waypoints=via:enc:wc\~oAwquwMdlTxiKtqLyiK:|enc:c\~vnAamswMvlTor@tjGi}L:| via:enc:udymA{\~bxM:\`
      
          \#\#\#\#\# Influence routes with stopover and pass through points
      
          For each waypoint in the request, the directions response appends an entry to the \`legs\` array to provide
          the details for stopovers on that leg of the journey.
      
          If you'd like to influence the route using waypoints without adding a stopover, add the prefix \`via:\` to the
          waypoint. Waypoints prefixed with \`via:\` will not add an entry to the \`legs\` array, but will route the
          journey through the waypoint.
      
          The following URL modifies the previous request such that the journey is routed through Lexington without
          stopping:
      
          \`\`\`
          https://maps.googleapis.com/maps/api/directions/json?
          origin=Boston,MA&destination=Concord,MA
          &waypoints=Charlestown,MA|via:Lexington,MA
          \`\`\`
      
          The \`via:\` prefix is most effective when creating routes in response to the user dragging the waypoints on
          the map. Doing so allows the user to see how the final route may look in real-time and helps ensure that
          waypoints are placed in locations that are accessible to the Directions API.
      
          <div class="caution">Caution: Using the \`via:\` prefix to avoid stopovers results in directions that are
          strict in their interpretation of the waypoint. This interpretation may result in severe detours on the route
          or \`ZERO_RESULTS\` in the response status code if the Directions API is unable to create directions through
          that point.</div>
      
      
          \#\#\#\#\# Optimize your waypoints
      
          By default, the Directions service calculates a route through the provided waypoints in their given order.
          Optionally, you may pass \`optimize:true\` as the first argument within the waypoints parameter to allow the
          Directions service to optimize the provided route by rearranging the waypoints in a more efficient order.
          (This optimization is an application of the traveling salesperson problem.) Travel time is the primary factor
          which is optimized, but other factors such as distance, number of turns and many more may be taken into
          account when deciding which route is the most efficient. All waypoints must be stopovers for the Directions
          service to optimize their route.
      
          If you instruct the Directions service to optimize the order of its waypoints, their order will be returned in
          the \`waypoint_order\` field within the routes object. The \`waypoint_order\` field returns values which are
          zero-based.
      
          The following example calculates a road journey from Adelaide, South Australia to each of South Australia's
          main wine regions using route optimization.
      
          \`\`\`
          https://maps.googleapis.com/maps/api/directions/json?
          origin=Adelaide,SA&destination=Adelaide,SA
          &waypoints=optimize:true|Barossa+Valley,SA|Clare,SA|Connawarra,SA|McLaren+Vale,SA
          \`\`\`
      
          Inspection of the calculated route will indicate that calculation uses waypoints in the following waypoint
          order:
      
          \`\`\`
          "waypoint_order": [ 3, 2, 0, 1 ]
          \`\`\`
      
          <div class="caution">Caution: Requests using waypoint optimization are billed at a higher rate. [Learn more
          about how Google Maps Platform products are
          billed.](https://developers.devsite.corp.google.com/maps/billing/gmp-billing\#directions-advanced)</div>**
      - Changed documentation of parameter avoid
        - Changes:\
          **It's possible to request a route that avoids any combination of tolls, highways and ferries by passing
          multiple restrictions to the avoid parameter. For example:
      
          \`\`\`
          avoid=tolls|highways|ferries.
          \`\`\`**
      - Changed documentation of parameter units
        - Changes:\
          ~~Note: this unit system setting only affects the text displayed within distance fields. The distance fields
          also contain values which are always expressed in meters.~~\
          **<div class="note">Note: this unit system setting only affects the text displayed within distance fields. The
          distance fields also contain values which are always expressed in meters.</div>**
      - Changed documentation of parameter departure_time
        - Changes:\
          ~~Specifies the desired time of departure. You can specify the time as an integer in seconds since midnight,
          January 1, 1970 UTC. If a departure_time later than 9999-12-31T23:59:59.999999999Z is specified, the API will
          fall back the departure_time to 9999-12-31T23:59:59.999999999Z. Alternatively, you can specify a value of now,
          which sets the departure time to the current time (correct to the nearest second). The departure time may be
          specified in two cases:~~\
          **Specifies the desired time of departure. You can specify the time as an integer in seconds since midnight,
          January 1, 1970 UTC. If a \`departure_time\` later than 9999-12-31T23:59:59.999999999Z is specified, the API
          will fall back the \`departure_time\` to 9999-12-31T23:59:59.999999999Z. Alternatively, you can specify a
          value of now, which sets the departure time to the current time (correct to the nearest second). The departure
          time may be specified in two cases:**\
          ~~\* For requests where the travel mode is transit: You can optionally specify one of departure_time or
          arrival_time. If neither time is specified, the departure_time defaults to now (that is, the departure time
          defaults to the current time).~~\
          **\* For requests where the travel mode is transit: You can optionally specify one of \`departure_time\` or
          \`arrival_time\`. If neither time is specified, the \`departure_time\` defaults to now (that is, the departure
          time defaults to the current time).**\
          ~~\* For requests where the travel mode is driving: You can specify the departure_time to receive a route and
          trip duration (response field: duration_in_traffic) that take traffic conditions into account. The
          departure_time must be set to the current time or some time in the future. It cannot be in the past.~~\
          **\* For requests where the travel mode is driving: You can specify the \`departure_time\` to receive a route
          and trip duration (response field: duration_in_traffic) that take traffic conditions into account. The
          \`departure_time\` must be set to the current time or some time in the future. It cannot be in the past.**\
          ~~Note: If departure time is not specified, choice of route and duration are based on road network and average
          time-independent traffic conditions. Results for a given request may vary over time due to changes in the road
          network, updated average traffic conditions, and the distributed nature of the service. Results may also vary
          between nearly-equivalent routes at any time or frequency.~~\
          **<div class="note">Note: If departure time is not specified, choice of route and duration are based on road
          network and average time-independent traffic conditions. Results for a given request may vary over time due to
          changes in the road network, updated average traffic conditions, and the distributed nature of the service.
          Results may also vary between nearly-equivalent routes at any time or frequency.</div>**
      - Changed documentation of parameter traffic_model
        - Changes:\
          ~~Specifies the assumptions to use when calculating time in traffic. This setting affects the value returned
          in the duration_in_traffic field in the response, which contains the predicted time in traffic based on
          historical averages. The traffic_model parameter may only be specified for driving directions where the
          request includes a departure_time. The available values for this parameter are:~~\
          **Specifies the assumptions to use when calculating time in traffic. This setting affects the value returned
          in the duration_in_traffic field in the response, which contains the predicted time in traffic based on
          historical averages. The \`traffic_model\` parameter may only be specified for driving directions where the
          request includes a \`departure_time\`. The available values for this parameter are:**\
          ~~\* \`best_guess\` (default) indicates that the returned duration_in_traffic should be the best estimate of
          travel time given what is known about both historical traffic conditions and live traffic. Live traffic
          becomes more important the closer the departure_time is to now.~~\
          **\* \`best_guess\` (default) indicates that the returned duration_in_traffic should be the best estimate of
          travel time given what is known about both historical traffic conditions and live traffic. Live traffic
          becomes more important the closer the \`departure_time\` is to now.**
    - In operation GET /maps/api/elevation/json
      - Changed documentation of parameter locations
        - Changes:\
          ~~- An array of coordinates separated using the pipe ('|') character:
          \`locations=40.714728,-73.998672|-34.397,150.644\`~~\
          **- An array of coordinates separated using the pipe ('|') character:**\
          ~~- A set of encoded coordinates using the [Encoded Polyline
          Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm):
          \`locations=enc:gfo}EtohhU\`~~\
          **\`\`\`**\
          **locations=40.714728,-73.998672|-34.397,150.644**\
          **\`\`\`
          - A set of encoded coordinates using the [Encoded Polyline
          Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm):
            \`\`\`
            locations=enc:gfo}EtohhU
            \`\`\`**
    - Changed documentation of operation GET /maps/api/geocode/json
      - Changes:\
        ~~To see countries currently supported by the Google Maps Platform Geocoding API, please consult the [Google
        Maps coverage data](https://developers.google.com/maps/coverage). The accuracy of geocoded locations may vary
        per country, so you should consider using the returned location_type field to determine if a good enough match
        has been found for the purposes of your application. Please note that the availability of geocoding data depends
        on our contracts with data providers, so it is subject to change.~~\
        **To see countries currently supported by the Google Maps Platform Geocoding API, please consult the [Google
        Maps coverage data](https://developers.google.com/maps/coverage). The accuracy of geocoded locations may vary
        per country, so you should consider using the returned \`location_type\` field to determine if a good enough
        match has been found for the purposes of your application. Please note that the availability of geocoding data
        depends on our contracts with data providers, so it is subject to change.**
    - In operation GET /maps/api/geocode/json
      - Changed documentation of parameter address
        - Changes:\
          ~~\`address=24%20Sussex%20Drive%20Ottawa%20ON\`~~\
          **\`\`\`**\
          **address=24%20Sussex%20Drive%20Ottawa%20ON**\
          **\`\`\`**\
          Format plus codes as shown here (plus signs are url-escaped to \`%2B\` and spaces are url-escaped to \`%20\`):
          - global code is a 4 character area code and 6 character or longer local code (\`849VCWC8+R9\` is
          \`849VCWC8%2BR9\`).
          - compound code is a 6 character or longer local code with an explicit location (\`CWC8+R9 Mountain View, CA,
          USA\` is \`CWC8%2BR9%20Mountain%20View%20CA%20USA\`).
    - In operation GET /v1/snapToRoads
      - Changed documentation of parameter path
        - Changes:\
          ~~Note: The snapping algorithm works best for points that are not too far apart. If you observe odd snapping
          behavior, try creating paths that have points closer together. To ensure the best snap-to-road quality, you
          should aim to provide paths on which consecutive pairs of points are within 300m of each other. This will also
          help in handling any isolated, long jumps between consecutive points caused by GPS signal loss, or noise.~~\
          **<div class="note">Note: The snapping algorithm works best for points that are not too far apart. If you
          observe odd snapping behavior, try creating paths that have points closer together. To ensure the best
          snap-to-road quality, you should aim to provide paths on which consecutive pairs of points are within 300m of
          each other. This will also help in handling any isolated, long jumps between consecutive points caused by GPS
          signal loss, or noise.</div>**
    - In operation GET /v1/nearestRoads
      - Changed documentation of parameter points
        - Changes:\
          ~~Note: The snapping algorithm works best for points that are not too far apart. If you observe odd snapping
          behavior, try creating paths that have points closer together. To ensure the best snap-to-road quality, you
          should aim to provide paths on which consecutive pairs of points are within 300m of each other. This will also
          help in handling any isolated, long jumps between consecutive points caused by GPS signal loss, or noise.~~\
          **<div class="note">Note: The snapping algorithm works best for points that are not too far apart. If you
          observe odd snapping behavior, try creating paths that have points closer together. To ensure the best
          snap-to-road quality, you should aim to provide paths on which consecutive pairs of points are within 300m of
          each other. This will also help in handling any isolated, long jumps between consecutive points caused by GPS
          signal loss, or noise.</div>**
    - In operation GET /maps/api/distanceMatrix/json
      - Changed documentation of parameter origins
        - Changes:\
          ~~Note: using place IDs is preferred over using addresses or latitude/longitude coordinates. Using coordinates
          will always result in the point being snapped to the road nearest to those coordinates - which may not be an
          access point to the property, or even a road that will quickly or safely lead to the destination.~~\
          **<div class="note">Note: using place IDs is preferred over using addresses or latitude/longitude coordinates.
          Using coordinates will always result in the point being snapped to the road nearest to those coordinates -
          which may not be an access point to the property, or even a road that will quickly or safely lead to the
          destination.</div>**\
          ~~- You can also include multiple encoded polylines, separated by the pipe character \`|\`. For example:
          \`origins=enc:wc\~oAwquwMdlTxiKtqLyiK:|enc:c\~vnAamswMvlTor@tjGi}L:|enc:udymA{\~bxM:\`~~\
          **- You can also include multiple encoded polylines, separated by the pipe character \`|\`. For example:**\
          **\`\`\`
              origins=enc:wc\~oAwquwMdlTxiKtqLyiK:|enc:c\~vnAamswMvlTor@tjGi}L:|enc:udymA{\~bxM:
              \`\`\`**
    - Changed documentation of parameter mode used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/distanceMatrix/json
      - Changes:\
        ~~For the calculation of distances and directions, you may specify the transportation mode to use. By default,
        \`DRIVING\` mode is used.~~\
        **For the calculation of distances and directions, you may specify the transportation mode to use. By default,
        \`DRIVING\` mode is used. By default, directions are calculated as driving directions. The following travel
        modes are supported:
    
        \* \`DRIVING\` (default) indicates standard driving directions or distance using the road network.
        \* \`WALKING\` requests walking directions or distance via pedestrian paths & sidewalks (where available).
        \* \`BICYCLING\` requests bicycling directions or distance via bicycle paths & preferred streets (where
        available).
        \* \`TRANSIT\` requests directions or distance via public transit routes (where available). If you set the mode
        to transit, you can optionally specify either a \`departure_time\` or an \`arrival_time\`. If neither time is
        specified, the \`departure_time\` defaults to now (that is, the departure time defaults to the current time).
        You can also optionally include a \`transit_mode\` and/or a \`transit_routing_preference\`.
    
        <div class="note">Note: Both walking and bicycling directions may sometimes not include clear pedestrian or
        bicycling paths, so these directions will return warnings in the returned result which you must display to the
        user.</div>**
    - Changed documentation of schema Bounds used in 6 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        A rectangle in geographical coordinates from points at the southwest and northeast corners.
    - Changed documentation of schema Geometry used in 4 endpoints
    
      - Used in GET /maps/api/place/details/json
      - Used in GET /maps/api/place/findplacefromtext/json
      - Used in GET /maps/api/place/nearbysearch/json
      - Used in GET /maps/api/place/textsearch/json
      - Changes:\
        An object describing the location.

Version 1.10.5 - PATCH
  - No changes

Version 1.10.4 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
          ~~\* Place IDs must be prefixed with place_id:. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see [Place
          Autocomplete and
          Directions](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions).
          For more about place IDs, see the [Place ID
          overview](https://developers.google.com/maps/documentation/places/web-service/place-id).~~\
          **\* Place IDs must be prefixed with \`place_id:\`. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see [Place
          Autocomplete and
          Directions](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions).
          For more about place IDs, see the [Place ID
          overview](https://developers.google.com/maps/documentation/places/web-service/place-id).**\
          ~~\`origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE\` For efficiency and accuracy, use place ID's when possible.
          These ID's are uniquely explicit like a lat/lng value pair and provide geocoding benefits for routing such as
          access points and traffic variables. Unlike an address, ID's do not require the service to perform a search or
          an intermediate request for place details; therefore, performance is better.~~\
          **_(newline)_**\
          **\`\`\`
            origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE
            \`\`\`**\
          ~~\`origin=24+Sussex+Drive+Ottawa+ON\`~~\
          **_(newline)_**\
          **\`\`\`
            origin=24+Sussex+Drive+Ottawa+ON
            \`\`\`**\
          ~~\`origin=41.43206,-81.38992\`~~\
          **_(newline)_**\
          ~~\* Plus codes must be formatted as a global code or a compound code. Format plus codes as shown here (plus
          signs are url-escaped to %2B and spaces are url-escaped to %20). Global code is a 4 character area code and 6
          character or longer local code (849VCWC8+R9 is 849VCWC8%2BR9). Compound code is a 6 character or longer local
          code with an explicit location (CWC8+R9 Mountain View, CA, USA is CWC8%2BR9%20Mountain%20View%20CA%20USA).~~\
          **\`\`\`**\
          **origin=41.43206,-81.38992
            \`\`\`
      
          \* Plus codes must be formatted as a global code or a compound code. Format plus codes as shown here (plus
          signs are url-escaped to \`%2B\` and spaces are url-escaped to \`%20\`).
      
            \* \*\*Global code\*\* is a 4 character area code and 6 character or longer local code (849VCWC8+R9 is
          \`849VCWC8%2BR9\`).
            \* \*\*Compound code\*\* is a 6 character or longer local code with an explicit location (CWC8+R9 Mountain
          View, CA, USA is \`CWC8%2BR9%20Mountain%20View%20CA%20USA\`).
      
          <div class="note">Note: For efficiency and accuracy, use place ID's when possible. These ID's are uniquely
          explicit like a lat/lng value pair and provide geocoding benefits for routing such as access points and
          traffic variables. Unlike an address, ID's do not require the service to perform a search or an intermediate
          request for place details; therefore, performance is better.</div>**
      - Changed documentation of parameter waypoints
        - Changes:\
          ~~\* Place ID: The unique value specific to a location (ChIJGwVKWe5w44kRcr4b9E25-Go).~~\
          **\* Place ID: The unique value specific to a location (\`ChIJGwVKWe5w44kRcr4b9E25-Go\`).**\
          ~~\* Address string (Charlestown, Boston,MA)~~\
          **\* Address string (\`Charlestown, Boston,MA\`)**\
          ~~\* Latitude/longitude coordinates (lat/lng): an explicit value pair. (-34.92788%2C138.60008 comma, no
          space)~~\
          **\* Latitude/longitude coordinates (lat/lng): an explicit value pair. (\`-34.92788%2C138.60008\` comma, no
          space)**\
          ~~\* Encoded polyline that can be specified by a set of any of the above. (enc:lexeF{\~wsZejrPjtye@:)~~\
          **\* Encoded polyline that can be specified by a set of any of the above. (\`enc:lexeF{\~wsZejrPjtye@:\`)**
      - Changed documentation of parameter alternatives
        - Changes:\
          ~~If set to true, specifies that the Directions service may provide more than one route alternative in the
          response. Note that providing route alternatives may increase the response time from the server. This is only
          available for requests without intermediate waypoints.~~\
          **If set to \`true\`, specifies that the Directions service may provide more than one route alternative in the
          response. Note that providing route alternatives may increase the response time from the server. This is only
          available for requests without intermediate waypoints. For more information, see the [guide to
          waypoints](https://developers.google.com/maps/documentation/directions/get-directions\#Waypoints).**

Version 1.10.3 - PATCH
  - No changes

Version 1.10.2 - PATCH
  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
          ~~The place ID, address, or textual latitude/longitude value from which you wish to calculate directions/~~\
          **The place ID, address, or textual latitude/longitude value from which you wish to calculate directions.**

Version 1.10.1 - PATCH
  - No changes

Version 1.10.0 - MINOR
  - BREAKING CHANGES
    - In operation GET /maps/api/directions/json
        - Removed parameter mode
    - In operation GET /maps/api/distanceMatrix/json
        - Removed parameter mode

  - Changes
    - In operation GET /maps/api/directions/json
      - Changed documentation of parameter origin
        - Changes:\
          ~~\* Place IDs must be prefixed with place_id:. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see Place
          Autocomplete and Directions. For more about place IDs, see the Place ID overview.~~\
          **\* Place IDs must be prefixed with place_id:. You can retrieve place IDs from the Geocoding API and the
          Places API (including Place Autocomplete). For an example using place IDs from Place Autocomplete, see [Place
          Autocomplete and
          Directions](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions).
          For more about place IDs, see the [Place ID
          overview](https://developers.google.com/maps/documentation/places/web-service/place-id).**\
          ~~\`origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE\`~~\
          **\`origin=place_id:ChIJ3S-JXmauEmsRUcIaWtf4MzE\` For efficiency and accuracy, use place ID's when possible.
          These ID's are uniquely explicit like a lat/lng value pair and provide geocoding benefits for routing such as
          access points and traffic variables. Unlike an address, ID's do not require the service to perform a search or
          an intermediate request for place details; therefore, performance is better.**

Version 1.9.0 - MINOR
  - Changes
    - Changed documentation of parameter language used in 3 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Used in GET /maps/api/timezone/json
      - Changes:\
        ~~https://developers.google.com/maps/faq\#languagesupport~~\
        **\* See the [list of supported languages](https://developers.google.com/maps/faq\#languagesupport). Google
        often updates the supported languages, so this list may not be exhaustive.
        \* If \`language\` is not supplied, the API attempts to use the preferred language as specified in the
        \`Accept-Language\` header, or the native language of the domain from which the request is sent.
        \* The API does its best to provide a street address that is readable for both the user and locals. To achieve
        that goal, it returns street addresses in the local language, transliterated to a script readable by the user if
        necessary, observing the preferred language. All other addresses are returned in the preferred language. Address
        components are all returned in the same language, which is chosen from the first component.
        \* If a name is not available in the preferred language, the API uses the closest match.
        \* The preferred language has a small influence on the set of results that the API chooses to return, and the
        order in which they are returned. The geocoder interprets abbreviations differently depending on language, such
        as the abbreviations for street types, or synonyms that may be valid in one language but not in another. For
        example, _utca_ and _tér_ are synonyms for street in Hungarian.**
    - Changed documentation of parameter region used in 2 endpoints
    
      - Used in GET /maps/api/directions/json
      - Used in GET /maps/api/geocode/json
      - Changes:\
        ~~The region code, specified as a ccTLD ("top-level domain") two-character value.
    
        https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains\#Country_code_top-level_domains~~\
        **The region code, specified as a [ccTLD ("top-level
        domain")](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains\#Country_code_top-level_domains)
        two-character value. Most ccTLD codes are identical to ISO 3166-1 codes, with some notable exceptions. For
        example, the United Kingdom's ccTLD is "uk" (.co.uk) while its ISO 3166-1 code is "gb" (technically for the
        entity of "The United Kingdom of Great Britain and Northern Ireland").**

Version 1.8.1 - PATCH
  - Changes
    - Changed documentation of schema ElevationStatus used in 1 endpoints
    
      - Used in GET /maps/api/elevation/json
      - Changes:\
        **- \`DATA_NOT_AVAILABLE\` indicating that there's no available data for the input locations.**

Version 1.8.0 - MINOR
  - No changes

Version 1.7.1 - PATCH
  - No changes

Version 1.7.0 - MINOR
  - No changes

Version 1.6.0 - MINOR
  - No changes

Version 1.5.3 - PATCH
  - No changes

Version 1.5.2 - PATCH
  - No changes

</details>

See [examples/googlemaps/API-CHANGELOG.detailed.md](https://github.com/ismailbennani/openapi-changelog/blob/main/examples/googlemaps/API-CHANGELOG.detailed.md)
