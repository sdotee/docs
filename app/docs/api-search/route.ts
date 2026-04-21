import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer as createMandarinTokenizer } from '@orama/tokenizers/mandarin';
import { createTokenizer as createJapaneseTokenizer } from '@orama/tokenizers/japanese';
import { stopwords as mandarinStopwords } from '@orama/stopwords/mandarin';
import { stopwords as japaneseStopwords } from '@orama/stopwords/japanese';

const mandarinTokenizer = createMandarinTokenizer({
  language: 'mandarin',
  stopWords: mandarinStopwords,
});

const japaneseTokenizer = createJapaneseTokenizer({
  language: 'japanese',
  stopWords: japaneseStopwords,
});

/**
 * Map our BCP 47 locales to Orama search configuration. Orama accepts either
 * a language name string (triggers a built-in stemmer) or an options object
 * with a custom tokenizer. CJK scripts require the dedicated tokenizers from
 * `@orama/tokenizers`; Korean has no Orama stemmer/tokenizer yet and falls
 * back to `english` (character-level best-effort). Polish, Estonian, and
 * Vietnamese also fall back to `english` since Orama doesn't ship stemmers
 * for them.
 */
export const { GET } = createFromSource(source, {
  localeMap: {
    'en-US': 'english',
    'zh-CN': { tokenizer: mandarinTokenizer },
    'zh-TW': { tokenizer: mandarinTokenizer },
    ja: { tokenizer: japaneseTokenizer },
    ko: 'english',
    id: 'indonesian',
    vi: 'english',
    de: 'german',
    fr: 'french',
    es: 'spanish',
    'pt-PT': 'portuguese',
    'pt-BR': 'portuguese',
    ru: 'russian',
    pl: 'english',
    et: 'english',
    nl: 'dutch',
    tr: 'turkish',
    sv: 'swedish',
    it: 'italian',
    fi: 'finnish',
  },
});
