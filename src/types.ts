export type MetadataRule = [string, (el: Element) => string | null];

export interface Context {
  url: string;
  options: Options;
}

export interface RuleSet {
  rules: MetadataRule[];
  defaultValue?: (context: Context) => string | string[];
  scorer?: (el: Element, score: any) => any;
  processor?: (input: any, context: Context) => any;
}

export interface Options {
  maxRedirects?: number;
  ua?: string;
  lang?: string;
  timeout?: number;
  forceImageHttps?: boolean;
  html?: string;
  url?: string;
  customRules?: Record<string, RuleSet>;
}
