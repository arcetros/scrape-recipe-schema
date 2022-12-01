import axios from 'axios';
import * as domino from 'domino';
// @ts-ignore
import microdata from 'microdata-node';
// import { validate } from 'jsonschema';

import { Options, RootSchema } from './types';
import { isValidHttpUrl } from './utils';
// import schema from './requiredProps.json';
import propertyTransformerMap from './utilities/transformRecipes';

const defaultOptions = {
    maxRedirects: 5, // Maximum number of redirects to follow
    lang: '*', // Specify accept-language header
    timeout: 10000, // Request timeout in miliseconds
};

export const consolidateRecipeProperties = (prospectiveProperties: any) => {
    const {
        url,
        name,
        image,
        photo,
        thumbnailUrl,
        description,
        cookTime,
        prepTime,
        totalTime,
        recipeYield,
        yield: rYield,
        recipeIngredients,
        recipeIngredient,
        ingredients,
        ingredient,
        recipeInstructions,
        instructions,
        step,
        recipeCategory,
        recipeCuisine,
        recipeType,
        keywords,
        tag,
    } = prospectiveProperties;

    // consolidate the properties into new model
    return {
        url,
        name, // string
        image: image || photo || thumbnailUrl, // string
        description, // string
        cookTime, // string
        cookTimeOriginalFormat: cookTime, // string
        prepTime, // string
        prepTimeOriginalFormat: prepTime, // string
        totalTime, // string
        totalTimeOriginalFormat: totalTime, // string
        recipeYield: recipeYield || rYield, // string
        recipeIngredients: recipeIngredient || recipeIngredients || ingredients || ingredient, // array of strings
        recipeInstructions: recipeInstructions || instructions || step, // array of strings
        recipeCategories: recipeCategory, // array of strings
        recipeCuisines: recipeCuisine, // array of strings
        recipeTypes: recipeType, // array of strings
        keywords: keywords || tag, // array of strings
    };
};

const convert_json_ld_recipe = (rec: any, nonStandard_attrs: boolean = false, url: string | undefined = undefined) => {
    const consolidatedRecipe = consolidateRecipeProperties(rec);
    const transformedRecipe: any = {};

    if (nonStandard_attrs) {
        transformedRecipe['_format'] = 'json-ld';
    } else {
        transformedRecipe['_format'] = 'microdata';
    }

    // store url to schema
    if (url) {
        if (consolidatedRecipe.url && consolidatedRecipe.url !== url && nonStandard_attrs) {
            transformedRecipe['_source_url'] = url;
        } else {
            consolidatedRecipe['url'] = url;
        }
    }

    Object.entries(consolidatedRecipe).forEach(([key, value]) => {
        const propertyTransformer = propertyTransformerMap[key];
        if (propertyTransformer && value) {
            transformedRecipe[key] = propertyTransformer(value, key);
        }
    });
    return transformedRecipe;
};

// const validateRecipeSchema = (rec: RootSchema) => {
//     const validator = { name: rec.name, recipeIngredient: rec.recipeIngredient, recipeInstructions: rec.recipeInstructions };
//     const response = validate(validator, schema);

//     if (!response.valid) {
//         return { status: false, data: undefined, message: 'Recipe not found on page' };
//     }
//     return { status: true, data: rec, message: 'success' };
// };

const getRecipeData = async (input: string | Partial<Options>, inputOptions: Partial<Options> = {}): Promise<any> => {
    let siteUrl: string, html, recipe: RootSchema | undefined;

    if (typeof input === 'object') {
        inputOptions = input;
        siteUrl = input.url as string;
    } else {
        siteUrl = input;
    }

    if (!isValidHttpUrl(siteUrl as string)) {
        throw new Error('url must start with http:// or https://');
    }

    const options = Object.assign({}, defaultOptions, inputOptions);

    if (!options.html) {
        const response = await axios.get(siteUrl as string, {
            responseType: 'text',
            headers: {
                'Accept-Language': options.lang,
            },
            timeout: options.timeout,
            maxRedirects: options.maxRedirects,
        });
        html = await response.data;
    } else {
        html = options.html as string;
    }

    const window = domino.createWindow(html).document;
    const jsonLds = Object.values(window.querySelectorAll("script[type='application/ld+json']"));

    if (jsonLds.length > 0) {
        jsonLds.forEach(json => {
            if (json.textContent) {
                const data = JSON.parse(json.textContent);
                if (data['@graph'] && Array.isArray(data['@graph'])) {
                    data['@graph'].forEach(g => {
                        if (g['@type'] === 'Recipe') {
                            const recipeData = convert_json_ld_recipe(g, true, siteUrl);
                            recipe = recipeData;
                        }
                    });
                }

                if (data['@type'] === 'Recipe') {
                    const recipeData = convert_json_ld_recipe(data, true, siteUrl);
                    recipe = recipeData;
                }

                if (Array.isArray(data['@type']) && data['@type'].includes('Recipe')) {
                    recipe = data;
                }
            }
        });
    } else {
        const meta = microdata.toJson(html);
        if (!meta || !meta.items || !meta.items[0]) {
            return { status: false, data: undefined, message: 'No Microdata tags present on page' };
        }
        const isRecipe: any = Object.values(meta.items).find((item: any) => item.type[0].indexOf('Recipe') > -1);
        recipe = isRecipe ? convert_json_ld_recipe(isRecipe.properties, false, siteUrl) : undefined;
    }

    if (recipe !== undefined) {
        return recipe;
    }

    return { status: false, data: undefined, message: 'No JSON+LD tags present on page' };
};

export default getRecipeData;
