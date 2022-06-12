# Webpack WAR plugin


This is a [Webpack](https://webpack.github.io/) plugin which simplifies and automates the creation of a [Web Application Archive (WAR)](https://en.wikipedia.org/wiki/WAR_(file_format)) from your Webpack build outputs and other project files. This can be useful if you want to deploy your static / Single Page Web App or your applications web frontend to a Java (EE) Application server.

## Installation
Install via npm

```bash
npm install --dev webpack-war-helper
```

## Usage
### Basic Usage
To add the webpack-war-helper to your build just add an instance of `WebpackWarHelper` to the `plugins` section of your Webpack configuration
```javascript
const { WebpackWarHelper } = require('webpack-war-helper');

module.exports = {
  ...,
  plugins: [
    new WebpackWarHelper(),
    ...
  ],
  ...
};
```
By default an archive containing all emitted Webpack build outputs is generated in the output directory of your Webpack build. It is named like your project.

### Configuration
You can influence the generated archive by supplying a configuration object of the following structure to the plugins constructor:
```typescript
type WebpackWarHelperOptions = {
    archiveName?: string;
    addVersion?: boolean;
    webInf?: string;
    additionalElements?: {
        path: string;
        destPath?: string;
    }[];
    archiverZipOptions?: {}
};
```
| Option | Effect |
| --- | --- |
| `archiveName` *[optional]* | Sets the output name of the archive |
| `addVersion` *[optional]* | Uses Package Version (default: true)|
| `webInf` *[optional]* | Specifies a path to a directory (or file) which will be included into the archive with the path `WEB-INF` |
| `additionalElements` *[optional]* | Specifies multiple files or directories, which will be included in the archive. Each entry is a object with the following properties: `path` (The path of the source element), `destPath` (*[optional]* The path of the specified file / directory inside of the archive [by default `path` is used])  |
| `archiverZipOptions` *[optional]* | Specifies the options that should be used by `archiver` (used to create the archive). See https://archiverjs.com/docs/ for more information. |

### Example
The following plugin configuration:
```javascript
const { WebpackWarHelper } = require('webpack-war-helper');

module.exports = {
  entry: {
    file1: './src/file1.js'
  },
  ...,
  plugins: [
    new WebpackWarHelper({
      archiveName: 'archive',
      addVersion: true,
      webInf: './web-inf',
      additionalElements: [
        { path: 'context/context.xml', destPath: 'META-INF/context.xml'},
        { path: 'package.json' },
        { path: 'images', destPath: 'assets/images' }
      ],
      archiverOptions: {
        zlib: {
          level: 9
        }
      }
    }),
    ...
  ],
  ...
};

```
generates an archive with the name `archive.war` in the Webpack output directory with the following structure:
```
archive##0.0.1.war
|
|\_ file1.js
|
|\_ WEB-INF
|          \_ web.xml
|
|\_ META-INF
|           \_ context.xml
|
|\_ package.json
|
 \_ assets
          \_ images
                   \_ img.png
```

## Development
### Typescript
The plugin is built with [Typescript](http://www.typescriptlang.org/) and the resulting package contains the corresponding typings.

### Building
After checking out the project you can build transpile the Typescript via
```bash
npm run build
```
The build output is stored in `dist`.



## Licensing
The app is distributed under the MIT License (read [`LICENSE`](LICENSE) for more information).
Copyright (c) 2022 Andreas Knaus (LINJAL GmbH)

## Collaborating
I really appreciate any kind of collaboration!<br>
You can use the [GitHub issue tracker](https://github.com/drknaus/webpack-war-helper/issues) for bugs and feature requests or [create a pull request](https://github.com/drknaus/webpack-war-helper/pulls) to submit
changes.

## Contact
If you have any questions, ideas, etc. feel free to contact me:<br>
drKnaus<br>
Email: <a href='mailto:aknaus@linjal.de'>aknaus@linjal.de</a><br>
Twitter: @drknaus<br>
LinkedIn: linkedin.com/in/drknaus<br>
Xing: xing.com/profile/Andreas_Knaus<br>

