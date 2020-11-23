# Klaud 9 Node API
https://api.klaud9.com/

## Requirements
Node +6.9

## Installation
npm install
cp ./config/config.dist.js ./config/config.js
Set the configuration

## Main Commands
npm start
npm stop
npm run logs
npm run test
npm run lint

# CLI

## BlueJeans
```
node ./cli/bluejeans.js help
```

## Elastic Search
```
node ./cli/elasticsearch.js help
```
Example:
```
node ./cli/elasticsearch.js updateAll
```

## Bulk Import
```
node ./cli/bulk.js help
```
Example
```
node ./cli/bulk.js import-photoshoots "" 200
```
<aside class="warning">
This script requires `antiword` installed.
</aside>

# Related Domains & S3
Little description of S3 structure

| Name        | Domains                                                                             | S3                           | Description                                 |
| ----------- | ----------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| Marketplace | https://www.klaud9.com                                                              | klaud9-web-prod              | Landpage & Marketplace                      |
| Admin       | <ul><li>https://admin.klaud9.com</li><li>https://photographers.klaud9.com</li></ul> | At this moment in EC2        | CMS                                         |
| CDN         | https://cdn.klaud9.com                                                              | klaud9-assets                | Public assets                               |
| Thumbnails  | https://thumbnails.klaud9.com                                                       | prod-klaud9-media-thumbnails | Public thumbnails                           |
| Profiles    | https://profiles.klaud9.com                                                         | prod-klaud9-profiles         | Public user images profiles                 |
| Originals   | Private                                                                             | prod-klaud9-media            | Private media                               |
| Docs        | Private                                                                             | klaud9-prod-documents        | Private model releases & national documents |

# Third Party
* Clarifai
* AWS-SDK
    * S3
    * CloudFront
    * Route53
    * EC2
    * RDS
    * ES
    * Certificate Manager
    * VPC
    * SES
* Bitbucket
* Trello
* Postman
