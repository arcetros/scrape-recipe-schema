import axios from 'axios';
import { Options } from './types';
import { isValidHttpUrl } from './utils';

const defaultOptions = {
    maxRedirects: 5,
    lang: '*',
    timeout: 10000,
    forceImageHttps: true,
    customRules: {},
};

const getRecipeData = async (input: string | Partial<Options>, inputOptions: Partial<Options> = {}) => {
    let siteUrl;

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

    let html;

    if (!options.url) {
        const response = await axios(siteUrl as string, {
            headers: {
                'Accept-Language': options.lang,
            },
            timeout: options.timeout,
            maxRedirects: options.maxRedirects,
        });
        html = response.data;
    } else {
        html = options.html;
    }

    console.log(html);
};

export default getRecipeData;
