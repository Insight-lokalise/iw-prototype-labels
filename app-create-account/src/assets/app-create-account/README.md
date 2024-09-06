# app-create-account

> This is the create account app that will be exposed as component in AEM so that marketing can create create account pages for PCM

## Development

To build and deploy to a local AEM instance, then watch for changes:

```
npm install
npm run start
```

## Production

To trigger a one-time production build (with minification) and deploy to AEM:

```
npm run build
npm run aem-import
```

## Configuration

### Override AEM config

To override default AEM port:

```
npm run [start|aem-import] -- --aem.port=5502
```

### Specify target website

By default the app will build for the US website. To target the EMEA site:

```
INSIGHT_ENV=emea npm run [start|build|aem-import]
```
