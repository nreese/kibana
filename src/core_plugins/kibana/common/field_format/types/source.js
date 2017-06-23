import _ from 'lodash';
import { noWhiteSpace } from '../../utils/no_white_space';
import { toJson } from '../../utils/aggressive_parse';
import { FieldFormat } from '../field_format';

export function stringifySource() {
  const template = _.template(noWhiteSpace(require('./_source.html')));

  _.class(Source).inherits(FieldFormat);
  function Source(params, getConfig) {
    Source.Super.call(this, params);

    this.getConfig = getConfig;
  }

  Source.id = '_source';
  Source.title = '_source';
  Source.fieldType = '_source';

  Source.prototype._convert = {
    text: (value) => toJson(value),
    html: function sourceToHtml(source, field, hit) {
      if (!field) return this.getConverterFor('text')(source, field, hit);

      const highlights = (hit && hit.highlight) || {};
      const formatted = field.indexPattern.formatHit(hit);
      const highlightPairs = [];
      const sourcePairs = [];

      const isShortDots = this.getConfig('shortDots:enable');
      _.keys(formatted).forEach((key) => {
        const pairs = highlights[key] ? highlightPairs : sourcePairs;
        const field = isShortDots ? _.shortenDottedString(key) : key;
        const val = formatted[key];
        pairs.push([field, val]);
      }, []);

      return template({ defPairs: highlightPairs.concat(sourcePairs) });
    }
  };

  return Source;
}
