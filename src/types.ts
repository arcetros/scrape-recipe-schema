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

export interface RootSchema {
    '@context': string;
    '@type': string;
    author: Author;
    cookTime: string;
    datePublished: string;
    description: string;
    image: string;
    keywords: string;
    name: string;
    nutrition: Nutrition;
    prepTime: string;
    recipeIngredient: string[];
    recipeInstructions: RecipeInstruction[];
    recipeYield: number;
    totalTime: string;
    _format: string;
    _source_url: string;
    url: string;
}
