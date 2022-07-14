/*
 * Copyright (C) 2022 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import IntlPolyfills from '../IntlPolyfills';
import type { Capability } from '@instructure/updown';
import { oncePerPage } from '@instructure/updown';
import { useTranslations } from '@canvas/i18n';

declare const ENV: {
  LOCALE?: string;
  readonly LOCALES: string[];
  [propName: string]: unknown;
};

// Backfill ENV.LOCALE from ENV.LOCALES[0] if it does not exist
const LocaleBackfill: Capability = {
  up: () => {
    if (Array.isArray(ENV.LOCALES) && typeof ENV.LOCALE === 'undefined') {
      ENV.LOCALE = ENV.LOCALES[0];
      return {
        down: () => {
          delete ENV.LOCALE;
        }
      };
    }
  },
  requires: []
};

// load the string translation file for this locale
const Translations: Capability = {
  up: oncePerPage('translations', async () => {
    const {default: translations} = await import(`translations/${ENV.LOCALE}.json`);
    useTranslations(ENV.LOCALE, translations);
  }),
  requires: [LocaleBackfill]
};

const I18n: Capability = {
  up: () => {},
  requires: [IntlPolyfills, Translations]
};

export {I18n, Translations};