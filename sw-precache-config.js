/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-env node */

module.exports = {
  staticFileGlobs: [
    'manifest.json',
    '/static/images/**/*',
    '/node_modules/leaflet/dist/leaflet.css',
    '/node_modules/leaflet/dist/leaflet.js',
    '/node_modules/leaflet-draw/dist/leaflet.draw.css',
    '/node_modules/leaflet-draw/dist/leaflet.draw.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
    'static/libs/uuid/uuid.min.js',
    'https://sdk.amazonaws.com/js/aws-sdk-2.452.0.min.js'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/@webcomponents\/webcomponentsjs\//,
      handler: 'fastest'
    },
    {
      urlPattern: /^https:\/\/fonts.googleapis.com\//,
      handler: 'fastest'
    }
  ]
};
