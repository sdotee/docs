import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer as createMandarinTokenizer } from '@orama/tokenizers/mandarin';
import { stopwords as mandarinStopwords } from '@orama/stopwords/mandarin';

const mandarinTokenizer = createMandarinTokenizer({
  language: 'mandarin',
  stopWords: mandarinStopwords,
});

/**
 * Map our BCP 47 locales to Orama search configuration. Orama accepts either
 * a language name string (triggers a built-in stemmer) or an options object
 * with a custom tokenizer. Chinese requires the dedicated tokenizer from
 * `@orama/tokenizers`.
 */
export const { GET } = createFromSource(source, {
  localeMap: {
    'en-US': 'english',
    'zh-CN': { tokenizer: mandarinTokenizer },
    'zh-TW': { tokenizer: mandarinTokenizer },
  },
});
