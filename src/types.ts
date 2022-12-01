export interface Options {
    maxRedirects?: number;
    lang?: string;
    timeout?: number;
    html?: string;
    url?: string;
}

export interface Author {
    '@type': string;
    name: string;
}

export interface Nutrition {
    '@type': string;
    calories: string;
    proteinContent: string;
    carbohydrateContent: string;
    fatContent: string;
    fiberContent: string;
    sugarContent: string;
}

export interface RecipeInstruction {
    '@type': string;
    text: string;
}

export interface BaseSchema extends RootSchema {
    photo: string;
    thumbnailUrl: string;
    yield: string | number;
    recipeIngredient: string[];
    ingredients: string[];
    ingredient: string[];
    instructions: string[];
    step: string[];
    recipeCategory: string[];
    recipeCuisine: string[];
    recipeType: string[];
    tag: string[];
}

export interface RootSchema {
    url: string;
    name: string;
    image: string;
    description: string;
    cookTime: string;
    prepTime: string;
    totalTime: string;
    recipeYield: string;
    recipeIngredients: string[];
    recipeInstructions: string[];
    recipeCategories: string[];
    recipeCuisines: string[];
    recipeTypes: string[];
    keywords: string[];
}

export interface Data {
    status: boolean;
    data: RootSchema | undefined;
    message: string;
}
