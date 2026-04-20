import enUS from './en-US.json';
import zhCN from './zh-CN.json';
import zhTW from './zh-TW.json';
import ja from './ja.json';
import ko from './ko.json';
import id from './id.json';
import vi from './vi.json';
import de from './de.json';
import fr from './fr.json';
import es from './es.json';
import ptPT from './pt-PT.json';
import ptBR from './pt-BR.json';
import ru from './ru.json';
import pl from './pl.json';
import et from './et.json';
import nl from './nl.json';
import tr from './tr.json';
import sv from './sv.json';
import it from './it.json';
import fi from './fi.json';
import { i18n } from '@/lib/i18n';

export type Messages = typeof enUS;

const messages: Record<string, Messages> = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  ko,
  id,
  vi,
  de,
  fr,
  es,
  'pt-PT': ptPT,
  'pt-BR': ptBR,
  ru,
  pl,
  et,
  nl,
  tr,
  sv,
  it,
  fi,
};

/** Get messages for a locale, falling back to the default language. */
export function getMessages(locale?: string): Messages {
  return messages[locale ?? ''] ?? messages[i18n.defaultLanguage];
}
