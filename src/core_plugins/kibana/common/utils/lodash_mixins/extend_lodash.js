import _ from 'lodash';
import { lodashStringMixin } from './string';
import { lodashLangMixin } from './lang';
import { lodashObjectMixin } from './object';
import { lodashCollectionMixin } from './collection';
import { lodashFunctionMixin } from './function';
import { lodashOopMixin } from './oop';

lodashStringMixin(_);
lodashLangMixin(_);
lodashObjectMixin(_);
lodashCollectionMixin(_);
lodashFunctionMixin(_);
lodashOopMixin(_);

export { _ };
