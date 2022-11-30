import axios from 'axios';
import * as domino from 'domino';

import { Options, RootSchema } from './types';
import { isValidHttpUrl } from './utils';

const defaultOptions = {
    maxRedirects: 5, // Maximum number of redirects to follow
    lang: '*', // Specify accept-language header
    timeout: 10000, // Request timeout in miliseconds
};

const convert_json_ld_recipe = (rec: RootSchema, nonStandard_attrs: boolean = false, url: string | undefined = undefined) => {
    let recCopy = rec;
    if (nonStandard_attrs) {
        recCopy['_format'] = 'json-ld';
    }

    // store url to schema
    if (url) {
        if (recCopy.url && recCopy.url !== url && nonStandard_attrs) {
            recCopy['_source_url'] = url;
        } else {
            recCopy['url'] = url;
        }
    }

    return recCopy;
};

const getRecipeData = async (input: string | Partial<Options>, inputOptions: Partial<Options> = {}): Promise<RootSchema | undefined> => {
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

    if (!options.url) {
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

                return undefined;
            }
            return undefined;
        });
    }

    if (recipe !== undefined) {
        return recipe;
    }
    return undefined;
};

export default getRecipeData;
