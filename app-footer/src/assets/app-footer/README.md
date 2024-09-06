# app-footer

> This is the footer app that appears at the bottom of all pages on the website. It consists of the contact us, about Insight, news letter, social icons.

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
