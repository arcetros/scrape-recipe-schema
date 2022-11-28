import axios from 'axios';
import * as domino from 'domino';

import { Options } from './types';
import { isValidHttpUrl } from './utils';

const defaultOptions = {
    maxRedirects: 5,
    lang: '*',
    timeout: 10000,
    forceImageHttps: true,
    customRules: {},
};

const getRecipeData = async (input: string | Partial<Options>, inputOptions: Partial<Options> = {}): Promise<any> => {
    let siteUrl, html, recipe;

    if (typeof input === 'object') {
        inputOptions = input;
        siteUrl = input.url;
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

    jsonLds.forEach(json => {
        if (json.textContent) {
            const data = JSON.parse(json.textContent);
            if (data['@graph'] && Array.isArray(data['@graph'])) {
                data['@graph'].forEach(g => {
                    if (g['@type'] === 'Recipe') {
                        recipe = g;
                    }
                });
            }

            if (data['@type'] === 'Recipe') {
                recipe = data;
            }

            if (Array.isArray(data['@type']) && data['@type'].includes('Recipe')) {
                recipe = data;
            }

            return undefined;
        }
        return undefined;
    });

    if (recipe !== undefined) {
        return recipe;
    }
    return undefined;
};

export default getRecipeData;
