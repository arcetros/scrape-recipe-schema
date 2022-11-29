# scrape-recipe-schema

> scrape-recipe-schema is a JavaScript library that will help you to scrape recipe Microdata/JSON-LD schema.

## 🚀 Get started

install [scrape-recipe-scehma](https://github.com/arcetros/scrape-recipe-schema) from npm

```bash
$ npm install scrape-schema-recipe
# or
$ yarn add scrape-schema-recipe
```

## 📚 Examples

```js
import getRecipeData from 'scrape-recipe-schema';

const url = 'https://stryve.life/recipes/creamy-courgette-potato-bake';

getRecipeData(url).then(data => {
    console.log(data);
});
```

or with `async/await`

```js
import getRecipeData from 'scrape-recipe-schema';

async function run() {
    const url = 'https://stryve.life/recipes/creamy-courgette-potato-bake';
    const data = await getMetaData(url);
    console.log(data);
}
```

This will return:

```js
/* Not yet implemented, but the data is exist. You can use it
```

## ⚙️ Configuration

You can change the behaviour of [scrape-recipe-scehma](https://github.com/arcetros/scrape-recipe-schema) by passing an options object:

```js
import getRecipeData from 'scrape-recipe-schema';

const options = {
    url: 'https://github.com/arcetros/scrape-recipe-schema', // URL of web page
    maxRedirects: 0, // Maximum number of redirects to follow (default: 5)
    ua: 'MyApp', // Specify User-Agent header
    lang: 'id-ID', // Specify Accept-Language header
    timeout: 1000, // Request timeout in milliseconds (default: 10000ms)
};

getRecipeData(options).then(data => {
    console.log(data);
});
```

You can specify the URL by either passing it as the first parameter, or by setting it in the options object.

## 🎢 Playground Commands

TSDX scaffolds your new library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

The recommended workflow is to run TSDX in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run the example inside another:

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**, we use [Parcel's aliasing](https://parceljs.org/module_resolution.html#aliases).

To do a one-off build, use `npm run build` or `yarn build`.

## Reference Documentation

Here are some references for how schema.org/Recipe _should_ be structured:

-   [https://schema.org/Recipe](https://schema.org/Recipe) - official specification
-   [Recipe Google Search Guide](https://developers.google.com/search/docs/data-types/recipe) - material teaching developers how to use the schema (with emphasis on how structured data impacts search results)

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
