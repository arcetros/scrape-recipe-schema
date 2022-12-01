import { MATCH_HTML_TAGS, MATCH_LINE_BREAK, MATCH_MULTI_SPACE } from './regex';
import { parse } from './iso8601';

export function transformImage(value: any) {
    if (typeof value === 'string') {
        return value;
    }

    if (value.url) {
        return value.url;
    }

    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export function transformToList(value: any) {
    if (typeof value === 'string') {
        if (value.includes(',')) {
            return value.split(',').map(item => item.trim());
        }

        return [value];
    }
    if (Array.isArray(value)) {
        return value;
    }
    return value;
}

export function transformToString(value: string) {
    if (typeof value === 'string') {
        return value;
    }
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

export function transformISOToString(dateObj: any) {
    let date = '';

    if (dateObj.days) {
        date += dateObj.days > 1 ? `${dateObj.days} days ` : `${dateObj.days} day `;
    }

    if (dateObj.hours) {
        date += dateObj.hours > 1 ? `${dateObj.hours} hours ` : `${dateObj.hours} hour `;
    }

    if (dateObj.minutes) {
        date += dateObj.minutes > 1 ? `${dateObj.minutes} minutes ` : `${dateObj.minutes} minute `;
    }

    if (dateObj.seconds) {
        date += dateObj.seconds > 1 ? `${dateObj.seconds} seconds ` : `${dateObj.seconds} second `;
    }

    return date.trim();
}

export function transformToTime(value: any) {
    const time = transformToString(value);
    try {
        const parsedISODuration = parse(time);
        if (parsedISODuration) {
            return transformISOToString(parsedISODuration);
        }
    } catch (error) {
        // fail silently and return original time
    }

    return time;
}

// for transformInstructions
export function cleanString(str: string) {
    return str
        .replace(MATCH_HTML_TAGS, '') // remove html
        .replace(MATCH_LINE_BREAK, ' ') // replace line breaks with spaces
        .replace(MATCH_MULTI_SPACE, ' ') // replace multiple spaces with single spaces
        .trim();
}

export function transformToCleanString(value: any) {
    return cleanString(transformToString(value));
}

export function transformInstructions(value: any) {
    if (typeof value === 'string') {
        const cleanedValue = cleanString(value);
        if (cleanedValue.includes('.,')) {
            // special case for kingarthurflour.com
            return cleanedValue.split('.,').map(item => item.trim());
        }

        return [cleanedValue];
    }

    if (Array.isArray(value)) {
        // microdata
        const firstItem = value[0];
        if (typeof firstItem === 'string') {
            return value.map(item => cleanString(item)); // loop through items and clean
        }

        // json ld
        return value.map(item => {
            if (item.text) {
                return cleanString(item.text);
            }
            return undefined;
        });
    }
    return;
}

const cleanIngredientAmounts = (line: string) =>
    line
        .replace(/¼/g, '1/4')
        .replace(/½/g, '1/2')
        .replace(/¾/g, '3/4')
        .replace(/⅔/g, '2/3')
        .replace(MATCH_HTML_TAGS, '')
        .replace(MATCH_MULTI_SPACE, ' ')
        .trim();

export function transformIngredients(value: Record<string, any>) {
    // jsonld
    if (value && typeof value[0] === 'string') {
        return value.map((item: any) => cleanIngredientAmounts(item));
    }

    // array of objects (microdata)
    const mappedItems = [] as any[];

    Object.entries(value).forEach(([, item]: any) => {
        if (item.properties) {
            const { name, amount } = item.properties;
            if (name || amount) {
                const _name = name && name[0];
                const _amount = amount && amount[0];
                const singleLine = _amount ? `${_amount} ${_name}` : _name;
                mappedItems.push(cleanIngredientAmounts(singleLine));
            }
        }
    });
    // log issue
    if (mappedItems.length) {
        return mappedItems;
    }
    return [];
}

const propertyTransformerMap: any = {
    name: transformToString,
    image: transformImage, // can just be string OR object with url, caption, width, height, thumbnail can be an array of strings
    description: transformToCleanString,
    cookTime: transformToTime,
    prepTime: transformToTime,
    totalTime: transformToTime,
    cookTimeOriginalFormat: transformToString,
    prepTimeOriginalFormat: transformToString,
    totalTimeOriginalFormat: transformToString,
    recipeYield: transformToString,
    recipeIngredients: transformIngredients,
    recipeInstructions: transformInstructions, // could be an array howtosteps - each has text with string
    recipeCategories: transformToList, // array
    recipeCuisines: transformToList, // array
    recipeTypes: transformToList,
    keywords: transformToList,
};

export default propertyTransformerMap;
