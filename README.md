# scrape-recipe-schema

[scrape-recipe-scehma](https://www.npmjs.com/package/scrape-recipe-schema) is a JavaScript library that will help you to extract recipe content from any websites, no guessing involved. Reading metadata is all that needed.

## 🚀 Get started

install [scrape-recipe-scehma](https://www.npmjs.com/package/scrape-recipe-schema) from npm

```bash
$ npm install scrape-schema-recipe
# or
$ yarn add scrape-schema-recipe
```

## 📚 Examples

Here are some examples on how to use [scrape-recipe-schema](https://www.npmjs.com/package/scrape-recipe-schema):

### Basic

Pass a url as first parameter and [scrape-recipe-schema](https://www.npmjs.com/package/scrape-recipe-schema) will attempt to extract the recipe content from that website.

```js
import getRecipeData from 'scrape-recipe-schema';

const url = 'https://example/recipes/creamy-courgette-potato-bake';

getRecipeData(url).then({ data } => {
    console.log(data);
});
```

or with `async/await`

```js
import getRecipeData from 'scrape-recipe-schema';

async function run() {
    const url = 'https://example/recipes/creamy-courgette-potato-bake';
    const { data } = await getMetaData(url);
    console.log(data);
}
```

Example file located at [example/index.jtsx](/example/index.tsx).

---

### HTML String

If you already have HTML string and dont want [scrape-recipe-schema](https://www.npmjs.com/package/scrape-recipe-schema) to make an http request, you can specify it in option object:

> **Note**
> This can be work only if there is JSON-LD or Microdata schema tags were present.

```js
import getRecipeData from 'scrape-recipe-schema';

const html = `
    <script type="application/ld+json">
        {
            "@context": "http://schema.org",
            "@type": "Recipe",
            "name": "Classic Marinara Sauce",
            "recipeIngredient": [
                "1 28-ounce can whole tomatoes",
                "1/4 cup olive oil",
                "7 garlic peeled and slivered",
                "Small dried whole chile",
                "1 teaspoon kosher salt",
                "1 large fresh basil sprig"
            ]
        }
     </script>
`;

const { data } = await getRecipeData({ html: html });
```

This is example for `JSON+LD`. Learn more aobut this format [here](https://json-ld.org/).

---

```js
import getRecipeData from 'scrape-recipe-schema';

const html = `
    <div itemscope itemtype="https://schema.org/Recipe">
        <h1 itemprop="name">Simple Marinara Sauce</h1>
        <div>
            <span itemprop="recipeIngredient">2 cans stewed tomatoes</span>
            <span itemprop="recipeIngredient">1 teaspoon dried oregano</span>
            <span itemprop="recipeIngredient">1 teaspoon salt</span>
        </div>
    </div>
`;

const { data } = await getRecipeData({ html: html });
```

This is example for `Microdata`. Learn more aobut this format [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Microdata).

## 📜 Here's what scrape-recipe-schema currently tries to scrape:

```js
{
    status: true,
    data: {
        "_format": "json-ld",
        "url": "https://example/recipes/creamy-courgette-potato-bake"
        "name": "Creamy courgette & potato bake",
        "image": "https://example/stryve/9ae78bc2-ad5e-449c-8626-8c9faa37054c_creamy-courgette-potato-bake.png?auto=compress,format",
        "cookTime": "45 minutes",
        "cookTimeOriginalFormat": "PT45M",
        "prepTime": "25 minutes",
        "prepTimeOriginalFormat": "PT25M",
        "totalTime": "70 minutes",
        "totalTimeOriginalFormat": "PT70M",
        "recipeYield": 4,
        "recipeIngredients": [
            "1000g Potato",
            "2 Courgette",
            "2 Brown onion",
            "3tsp Olive oil",
            "120g Cashew nuts",
            "200ml Vegetable stock",
            "200ml Almond milk",
            "6 Garlic cloves",
            "18tsp Nutritional yeast",
            "2tsp Sea salt",
            "2tsp Smoked paprika"
        ],
        "recipeInstructions": [
            "Add cashew nuts to a bowl with enough hot water to cover",
            "Peel and thinly slice the potatoes and courgettes",
            "Thinly slice the onion and add to a pan with olive oil – fry for ~5 mins mixing often until lightly brown",
            "Pre-heat the oven on 180°C (355°F)",
            "Drain the water from cashew nuts and place in blender with vegetable stock, almond milk, garlic, nutritional yeast and salt – blend until smooth",
            "To your oven dish add a layer potato, followed by a layer of courgette, followed by the onion",
            "Next sprinkle half of the smoked paprika on top",
            "Continue adding another layer of potato, followed by another layer of courgette and pour ⅔ of the creamy sauce on top",
            "Finish off with one more layer of potatoes, the remaining sauce and the other half of the smoked paprika – place in the oven for 45 mins"
        ]
    },
    message: "success"
}
```

## ⚙️ Configuration

You can change the behaviour of [scrape-recipe-scehma](https://www.npmjs.com/package/scrape-recipe-schema) by passing an options object:

```js
import getRecipeData from 'scrape-recipe-schema';

const options = {
    url: 'https://github.com/arcetros/scrape-recipe-schema', // URL of web page
    maxRedirects: 0, // Maximum number of redirects to follow (default: 5)
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
