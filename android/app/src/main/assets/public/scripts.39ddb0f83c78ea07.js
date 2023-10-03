import _extends from "@babel/runtime/helpers/extends";
import typedFunction from 'typed-function';
import { deepFlatten, isLegacyFactory, values } from '../utils/object.js';
import * as emitter from './../utils/emitter.js';
import { importFactory } from './function/import.js';
import { configFactory } from './function/config.js';
import { factory, isFactory } from '../utils/factory.js';
import { isAccessorNode, isArray, isArrayNode, isAssignmentNode, isBigNumber, isBlockNode, isBoolean, isChain, isCollection, isComplex, isConditionalNode, isConstantNode, isDate, isDenseMatrix, isFraction, isFunction, isFunctionAssignmentNode, isFunctionNode, isHelp, isIndex, isIndexNode, isMatrix, isNode, isNull, isNumber, isObject, isObjectNode, isOperatorNode, isParenthesisNode, isRange, isRangeNode, isRelationalNode, isRegExp, isResultSet, isSparseMatrix, isString, isSymbolNode, isUndefined, isUnit } from '../utils/is.js';
import { ArgumentsError } from '../error/ArgumentsError.js';
import { DimensionError } from '../error/DimensionError.js';
import { IndexError } from '../error/IndexError.js';
import { DEFAULT_CONFIG } from './config.js';

/**
 * Create a mathjs instance from given factory functions and optionally config
 *
 * Usage:
 *
 *     const mathjs1 = create({ createAdd, createMultiply, ...})
 *     const config = { number: 'BigNumber' }
 *     const mathjs2 = create(all, config)
 *
 * @param {Object} [factories] An object with factory functions
 *                             The object can contain nested objects,
 *                             all nested objects will be flattened.
 * @param {Object} [config]    Available options:
 *                            {number} epsilon
 *                              Minimum relative difference between two
 *                              compared values, used by all comparison functions.
 *                            {string} matrix
 *                              A string 'Matrix' (default) or 'Array'.
 *                            {string} number
 *                              A string 'number' (default), 'BigNumber', or 'Fraction'
 *                            {number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 *                            {boolean} predictable
 *                              Predictable output type of functions. When true,
 *                              output type depends only on the input types. When
 *                              false (default), output type can vary depending
 *                              on input values. For example `math.sqrt(-4)`
 *                              returns `complex('2i')` when predictable is false, and
 *                              returns `NaN` when true.
 *                            {string} randomSeed
 *                              Random seed for seeded pseudo random number generator.
 *                              Set to null to randomly seed.
 * @returns {Object} Returns a bare-bone math.js instance containing
 *                   functions:
 *                   - `import` to add new functions
 *                   - `config` to change configuration
 *                   - `on`, `off`, `once`, `emit` for events
 */
export function create(factories, config) {
  var configInternal = _extends({}, DEFAULT_CONFIG, config);

  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' + 'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // create the mathjs instance
  var math = emitter.mixin({
    // only here for backward compatibility for legacy factory functions
    isNumber,
    isComplex,
    isBigNumber,
    isFraction,
    isUnit,
    isString,
    isArray,
    isMatrix,
    isCollection,
    isDenseMatrix,
    isSparseMatrix,
    isRange,
    isIndex,
    isBoolean,
    isResultSet,
    isHelp,
    isFunction,
    isDate,
    isRegExp,
    isObject,
    isNull,
    isUndefined,
    isAccessorNode,
    isArrayNode,
    isAssignmentNode,
    isBlockNode,
    isConditionalNode,
    isConstantNode,
    isFunctionAssignmentNode,
    isFunctionNode,
    isIndexNode,
    isNode,
    isObjectNode,
    isOperatorNode,
    isParenthesisNode,
    isRangeNode,
    isRelationalNode,
    isSymbolNode,
    isChain
  });

  // load config function and apply provided config
  math.config = configFactory(configInternal, math.emit);
  math.expression = {
    transform: {},
    mathWithTransform: {
      config: math.config
    }
  };

  // cached factories and instances used by function load
  var legacyFactories = [];
  var legacyInstances = [];

  /**
   * Load a function or data type from a factory.
   * If the function or data type already exists, the existing instance is
   * returned.
   * @param {Function} factory
   * @returns {*}
   */
  function load(factory) {
    if (isFactory(factory)) {
      return factory(math);
    }
    var firstProperty = factory[Object.keys(factory)[0]];
    if (isFactory(firstProperty)) {
      return firstProperty(math);
    }
    if (!isLegacyFactory(factory)) {
      console.warn('Factory object with properties `type`, `name`, and `factory` expected', factory);
      throw new Error('Factory object with properties `type`, `name`, and `factory` expected');
    }
    var index = legacyFactories.indexOf(factory);
    var instance;
    if (index === -1) {
      // doesn't yet exist
      if (factory.math === true) {
        // pass with math namespace
        instance = factory.factory(math.type, configInternal, load, math.typed, math);
      } else {
        instance = factory.factory(math.type, configInternal, load, math.typed);
      }

      // append to the cache
      legacyFactories.push(factory);
      legacyInstances.push(instance);
    } else {
      // already existing function, return the cached instance
      instance = legacyInstances[index];
    }
    return instance;
  }
  var importedFactories = {};

  // load the import function
  function lazyTyped() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return math.typed.apply(math.typed, args);
  }
  lazyTyped.isTypedFunction = typedFunction.isTypedFunction;
  var internalImport = importFactory(lazyTyped, load, math, importedFactories);
  math.import = internalImport;

  // listen for changes in config, import all functions again when changed
  // TODO: move this listener into the import function?
  math.on('config', () => {
    values(importedFactories).forEach(factory => {
      if (factory && factory.meta && factory.meta.recreateOnConfigChange) {
        // FIXME: only re-create when the current instance is the same as was initially created
        // FIXME: delete the functions/constants before importing them again?
        internalImport(factory, {
          override: true
        });
      }
    });
  });

  // the create function exposed on the mathjs instance is bound to
  // the factory functions passed before
  math.create = create.bind(null, factories);

  // export factory function
  math.factory = factory;

  // import the factory functions like createAdd as an array instead of object,
  // else they will get a different naming (`createAdd` instead of `add`).
  math.import(values(deepFlatten(factories)));
  math.ArgumentsError = ArgumentsError;
  math.DimensionError = DimensionError;
  math.IndexError = IndexError;
  return math;
}
;import seedrandom from 'seedrandom';
var singletonRandom = /* #__PURE__ */seedrandom(Date.now());
export function createRng(randomSeed) {
  var random;

  // create a new random generator with given seed
  function setSeed(seed) {
    random = seed === null ? singletonRandom : seedrandom(String(seed));
  }

  // initialize a seeded pseudo random number generator with config's random seed
  setSeed(randomSeed);

  // wrapper function so the rng can be updated via generator
  function rng() {
    return random();
  }
  return rng;
}
;import naturalSort from 'javascript-natural-sort';
import { isDenseMatrix, isSparseMatrix, typeOf } from '../../utils/is.js';
import { factory } from '../../utils/factory.js';
var name = 'compareNatural';
var dependencies = ['typed', 'compare'];
export var createCompareNatural = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    compare
  } = _ref;
  var compareBooleans = compare.signatures['boolean,boolean'];

  /**
   * Compare two values of any type in a deterministic, natural way.
   *
   * For numeric values, the function works the same as `math.compare`.
   * For types of values that can't be compared mathematically,
   * the function compares in a natural way.
   *
   * For numeric values, x and y are considered equal when the relative
   * difference between x and y is smaller than the configured epsilon.
   * The function cannot be used to compare values smaller than
   * approximately 2.22e-16.
   *
   * For Complex numbers, first the real parts are compared. If equal,
   * the imaginary parts are compared.
   *
   * Strings are compared with a natural sorting algorithm, which
   * orders strings in a "logic" way following some heuristics.
   * This differs from the function `compare`, which converts the string
   * into a numeric value and compares that. The function `compareText`
   * on the other hand compares text lexically.
   *
   * Arrays and Matrices are compared value by value until there is an
   * unequal pair of values encountered. Objects are compared by sorted
   * keys until the keys or their values are unequal.
   *
   * Syntax:
   *
   *    math.compareNatural(x, y)
   *
   * Examples:
   *
   *    math.compareNatural(6, 1)              // returns 1
   *    math.compareNatural(2, 3)              // returns -1
   *    math.compareNatural(7, 7)              // returns 0
   *
   *    math.compareNatural('10', '2')         // returns 1
   *    math.compareText('10', '2')            // returns -1
   *    math.compare('10', '2')                // returns 1
   *
   *    math.compareNatural('Answer: 10', 'Answer: 2') // returns 1
   *    math.compareText('Answer: 10', 'Answer: 2')    // returns -1
   *    math.compare('Answer: 10', 'Answer: 2')
   *        // Error: Cannot convert "Answer: 10" to a number
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('40 mm')
   *    math.compareNatural(a, b)              // returns 1
   *
   *    const c = math.complex('2 + 3i')
   *    const d = math.complex('2 + 4i')
   *    math.compareNatural(c, d)              // returns -1
   *
   *    math.compareNatural([1, 2, 4], [1, 2, 3]) // returns 1
   *    math.compareNatural([1, 2, 3], [1, 2])    // returns 1
   *    math.compareNatural([1, 5], [1, 2, 3])    // returns 1
   *    math.compareNatural([1, 2], [1, 2])       // returns 0
   *
   *    math.compareNatural({a: 2}, {a: 4})       // returns -1
   *
   * See also:
   *
   *    compare, compareText
   *
   * @param  {*} x First value to compare
   * @param  {*} y Second value to compare
   * @return {number} Returns the result of the comparison:
   *                  1 when x > y, -1 when x < y, and 0 when x == y.
   */
  return typed(name, {
    'any, any': _compareNatural
  }); // just to check # args

  function _compareNatural(x, y) {
    var typeX = typeOf(x);
    var typeY = typeOf(y);
    var c;

    // numeric types
    if ((typeX === 'number' || typeX === 'BigNumber' || typeX === 'Fraction') && (typeY === 'number' || typeY === 'BigNumber' || typeY === 'Fraction')) {
      c = compare(x, y);
      if (c.toString() !== '0') {
        // c can be number, BigNumber, or Fraction
        return c > 0 ? 1 : -1; // return a number
      } else {
        return naturalSort(typeX, typeY);
      }
    }

    // matrix types
    var matTypes = ['Array', 'DenseMatrix', 'SparseMatrix'];
    if (matTypes.includes(typeX) || matTypes.includes(typeY)) {
      c = compareMatricesAndArrays(_compareNatural, x, y);
      if (c !== 0) {
        return c;
      } else {
        return naturalSort(typeX, typeY);
      }
    }

    // in case of different types, order by name of type, i.e. 'BigNumber' < 'Complex'
    if (typeX !== typeY) {
      return naturalSort(typeX, typeY);
    }
    if (typeX === 'Complex') {
      return compareComplexNumbers(x, y);
    }
    if (typeX === 'Unit') {
      if (x.equalBase(y)) {
        return _compareNatural(x.value, y.value);
      }

      // compare by units
      return compareArrays(_compareNatural, x.formatUnits(), y.formatUnits());
    }
    if (typeX === 'boolean') {
      return compareBooleans(x, y);
    }
    if (typeX === 'string') {
      return naturalSort(x, y);
    }
    if (typeX === 'Object') {
      return compareObjects(_compareNatural, x, y);
    }
    if (typeX === 'null') {
      return 0;
    }
    if (typeX === 'undefined') {
      return 0;
    }

    // this should not occur...
    throw new TypeError('Unsupported type of value "' + typeX + '"');
  }

  /**
   * Compare mixed matrix/array types, by converting to same-shaped array.
   * This comparator is non-deterministic regarding input types.
   * @param {Array | SparseMatrix | DenseMatrix | *} x
   * @param {Array | SparseMatrix | DenseMatrix | *} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareMatricesAndArrays(compareNatural, x, y) {
    if (isSparseMatrix(x) && isSparseMatrix(y)) {
      return compareArrays(compareNatural, x.toJSON().values, y.toJSON().values);
    }
    if (isSparseMatrix(x)) {
      // note: convert to array is expensive
      return compareMatricesAndArrays(compareNatural, x.toArray(), y);
    }
    if (isSparseMatrix(y)) {
      // note: convert to array is expensive
      return compareMatricesAndArrays(compareNatural, x, y.toArray());
    }

    // convert DenseArray into Array
    if (isDenseMatrix(x)) {
      return compareMatricesAndArrays(compareNatural, x.toJSON().data, y);
    }
    if (isDenseMatrix(y)) {
      return compareMatricesAndArrays(compareNatural, x, y.toJSON().data);
    }

    // convert scalars to array
    if (!Array.isArray(x)) {
      return compareMatricesAndArrays(compareNatural, [x], y);
    }
    if (!Array.isArray(y)) {
      return compareMatricesAndArrays(compareNatural, x, [y]);
    }
    return compareArrays(compareNatural, x, y);
  }

  /**
   * Compare two Arrays
   *
   * - First, compares value by value
   * - Next, if all corresponding values are equal,
   *   look at the length: longest array will be considered largest
   *
   * @param {Array} x
   * @param {Array} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareArrays(compareNatural, x, y) {
    // compare each value
    for (var i = 0, ii = Math.min(x.length, y.length); i < ii; i++) {
      var v = compareNatural(x[i], y[i]);
      if (v !== 0) {
        return v;
      }
    }

    // compare the size of the arrays
    if (x.length > y.length) {
      return 1;
    }
    if (x.length < y.length) {
      return -1;
    }

    // both Arrays have equal size and content
    return 0;
  }

  /**
   * Compare two objects
   *
   * - First, compare sorted property names
   * - Next, compare the property values
   *
   * @param {Object} x
   * @param {Object} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareObjects(compareNatural, x, y) {
    var keysX = Object.keys(x);
    var keysY = Object.keys(y);

    // compare keys
    keysX.sort(naturalSort);
    keysY.sort(naturalSort);
    var c = compareArrays(compareNatural, keysX, keysY);
    if (c !== 0) {
      return c;
    }

    // compare values
    for (var i = 0; i < keysX.length; i++) {
      var v = compareNatural(x[keysX[i]], y[keysY[i]]);
      if (v !== 0) {
        return v;
      }
    }
    return 0;
  }
});

/**
 * Compare two complex numbers, `x` and `y`:
 *
 * - First, compare the real values of `x` and `y`
 * - If equal, compare the imaginary values of `x` and `y`
 *
 * @params {Complex} x
 * @params {Complex} y
 * @returns {number} Returns the comparison result: -1, 0, or 1
 */
function compareComplexNumbers(x, y) {
  if (x.re > y.re) {
    return 1;
  }
  if (x.re < y.re) {
    return -1;
  }
  if (x.im > y.im) {
    return 1;
  }
  if (x.im < y.im) {
    return -1;
  }
  return 0;
}
;import Complex from 'complex.js';
import { format } from '../../utils/number.js';
import { isNumber, isUnit } from '../../utils/is.js';
import { factory } from '../../utils/factory.js';
var name = 'Complex';
var dependencies = [];
export var createComplexClass = /* #__PURE__ */factory(name, dependencies, () => {
  /**
   * Attach type information
   */
  Object.defineProperty(Complex, 'name', {
    value: 'Complex'
  });
  Complex.prototype.constructor = Complex;
  Complex.prototype.type = 'Complex';
  Complex.prototype.isComplex = true;

  /**
   * Get a JSON representation of the complex number
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Complex", "re": 2, "im": 3}`
   */
  Complex.prototype.toJSON = function () {
    return {
      mathjs: 'Complex',
      re: this.re,
      im: this.im
    };
  };

  /*
   * Return the value of the complex number in polar notation
   * The angle phi will be set in the interval of [-pi, pi].
   * @return {{r: number, phi: number}} Returns and object with properties r and phi.
   */
  Complex.prototype.toPolar = function () {
    return {
      r: this.abs(),
      phi: this.arg()
    };
  };

  /**
   * Get a string representation of the complex number,
   * with optional formatting options.
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @return {string} str
   */
  Complex.prototype.format = function (options) {
    var str = '';
    var im = this.im;
    var re = this.re;
    var strRe = format(this.re, options);
    var strIm = format(this.im, options);

    // round either re or im when smaller than the configured precision
    var precision = isNumber(options) ? options : options ? options.precision : null;
    if (precision !== null) {
      var epsilon = Math.pow(10, -precision);
      if (Math.abs(re / im) < epsilon) {
        re = 0;
      }
      if (Math.abs(im / re) < epsilon) {
        im = 0;
      }
    }
    if (im === 0) {
      // real value
      str = strRe;
    } else if (re === 0) {
      // purely complex value
      if (im === 1) {
        str = 'i';
      } else if (im === -1) {
        str = '-i';
      } else {
        str = strIm + 'i';
      }
    } else {
      // complex value
      if (im < 0) {
        if (im === -1) {
          str = strRe + ' - i';
        } else {
          str = strRe + ' - ' + strIm.substring(1) + 'i';
        }
      } else {
        if (im === 1) {
          str = strRe + ' + i';
        } else {
          str = strRe + ' + ' + strIm + 'i';
        }
      }
    }
    return str;
  };

  /**
   * Create a complex number from polar coordinates
   *
   * Usage:
   *
   *     Complex.fromPolar(r: number, phi: number) : Complex
   *     Complex.fromPolar({r: number, phi: number}) : Complex
   *
   * @param {*} args...
   * @return {Complex}
   */
  Complex.fromPolar = function (args) {
    switch (arguments.length) {
      case 1:
        {
          var arg = arguments[0];
          if (typeof arg === 'object') {
            return Complex(arg);
          } else {
            throw new TypeError('Input has to be an object with r and phi keys.');
          }
        }
      case 2:
        {
          var r = arguments[0];
          var phi = arguments[1];
          if (isNumber(r)) {
            if (isUnit(phi) && phi.hasBase('ANGLE')) {
              // convert unit to a number in radians
              phi = phi.toNumber('rad');
            }
            if (isNumber(phi)) {
              return new Complex({
                r,
                phi
              });
            }
            throw new TypeError('Phi is not a number nor an angle unit.');
          } else {
            throw new TypeError('Radius r is not a number.');
          }
        }
      default:
        throw new SyntaxError('Wrong number of arguments in function fromPolar');
    }
  };
  Complex.prototype.valueOf = Complex.prototype.toString;

  /**
   * Create a Complex number from a JSON object
   * @param {Object} json  A JSON Object structured as
   *                       {"mathjs": "Complex", "re": 2, "im": 3}
   *                       All properties are optional, default values
   *                       for `re` and `im` are 0.
   * @return {Complex} Returns a new Complex number
   */
  Complex.fromJSON = function (json) {
    return new Complex(json);
  };

  /**
   * Compare two complex numbers, `a` and `b`:
   *
   * - Returns 1 when the real part of `a` is larger than the real part of `b`
   * - Returns -1 when the real part of `a` is smaller than the real part of `b`
   * - Returns 1 when the real parts are equal
   *   and the imaginary part of `a` is larger than the imaginary part of `b`
   * - Returns -1 when the real parts are equal
   *   and the imaginary part of `a` is smaller than the imaginary part of `b`
   * - Returns 0 when both real and imaginary parts are equal.
   *
   * @params {Complex} a
   * @params {Complex} b
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  Complex.compare = function (a, b) {
    if (a.re > b.re) {
      return 1;
    }
    if (a.re < b.re) {
      return -1;
    }
    if (a.im > b.im) {
      return 1;
    }
    if (a.im < b.im) {
      return -1;
    }
    return 0;
  };
  return Complex;
}, {
  isClass: true
});
;import Fraction from 'fraction.js';
import { factory } from '../../utils/factory.js';
var name = 'Fraction';
var dependencies = [];
export var createFractionClass = /* #__PURE__ */factory(name, dependencies, () => {
  /**
   * Attach type information
   */
  Object.defineProperty(Fraction, 'name', {
    value: 'Fraction'
  });
  Fraction.prototype.constructor = Fraction;
  Fraction.prototype.type = 'Fraction';
  Fraction.prototype.isFraction = true;

  /**
   * Get a JSON representation of a Fraction containing type information
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Fraction", "n": 3, "d": 8}`
   */
  Fraction.prototype.toJSON = function () {
    return {
      mathjs: 'Fraction',
      n: this.s * this.n,
      d: this.d
    };
  };

  /**
   * Instantiate a Fraction from a JSON object
   * @param {Object} json  a JSON object structured as:
   *                       `{"mathjs": "Fraction", "n": 3, "d": 8}`
   * @return {BigNumber}
   */
  Fraction.fromJSON = function (json) {
    return new Fraction(json);
  };
  return Fraction;
}, {
  isClass: true
});
;/* eslint no-template-curly-in-string: "off" */

import escapeLatexLib from 'escape-latex';
import { hasOwnProperty } from './object.js';
export var latexSymbols = {
  // GREEK LETTERS
  Alpha: 'A',
  alpha: '\\alpha',
  Beta: 'B',
  beta: '\\beta',
  Gamma: '\\Gamma',
  gamma: '\\gamma',
  Delta: '\\Delta',
  delta: '\\delta',
  Epsilon: 'E',
  epsilon: '\\epsilon',
  varepsilon: '\\varepsilon',
  Zeta: 'Z',
  zeta: '\\zeta',
  Eta: 'H',
  eta: '\\eta',
  Theta: '\\Theta',
  theta: '\\theta',
  vartheta: '\\vartheta',
  Iota: 'I',
  iota: '\\iota',
  Kappa: 'K',
  kappa: '\\kappa',
  varkappa: '\\varkappa',
  Lambda: '\\Lambda',
  lambda: '\\lambda',
  Mu: 'M',
  mu: '\\mu',
  Nu: 'N',
  nu: '\\nu',
  Xi: '\\Xi',
  xi: '\\xi',
  Omicron: 'O',
  omicron: 'o',
  Pi: '\\Pi',
  pi: '\\pi',
  varpi: '\\varpi',
  Rho: 'P',
  rho: '\\rho',
  varrho: '\\varrho',
  Sigma: '\\Sigma',
  sigma: '\\sigma',
  varsigma: '\\varsigma',
  Tau: 'T',
  tau: '\\tau',
  Upsilon: '\\Upsilon',
  upsilon: '\\upsilon',
  Phi: '\\Phi',
  phi: '\\phi',
  varphi: '\\varphi',
  Chi: 'X',
  chi: '\\chi',
  Psi: '\\Psi',
  psi: '\\psi',
  Omega: '\\Omega',
  omega: '\\omega',
  // logic
  true: '\\mathrm{True}',
  false: '\\mathrm{False}',
  // other
  i: 'i',
  // TODO use \i ??
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: '\\lim',
  undefined: '\\mathbf{?}'
};
export var latexOperators = {
  transpose: '^\\top',
  ctranspose: '^H',
  factorial: '!',
  pow: '^',
  dotPow: '.^\\wedge',
  // TODO find ideal solution
  unaryPlus: '+',
  unaryMinus: '-',
  bitNot: '\\~',
  // TODO find ideal solution
  not: '\\neg',
  multiply: '\\cdot',
  divide: '\\frac',
  // TODO how to handle that properly?
  dotMultiply: '.\\cdot',
  // TODO find ideal solution
  dotDivide: '.:',
  // TODO find ideal solution
  mod: '\\mod',
  add: '+',
  subtract: '-',
  to: '\\rightarrow',
  leftShift: '<<',
  rightArithShift: '>>',
  rightLogShift: '>>>',
  equal: '=',
  unequal: '\\neq',
  smaller: '<',
  larger: '>',
  smallerEq: '\\leq',
  largerEq: '\\geq',
  bitAnd: '\\&',
  bitXor: '\\underline{|}',
  bitOr: '|',
  and: '\\wedge',
  xor: '\\veebar',
  or: '\\vee'
};
export var latexFunctions = {
  // arithmetic
  abs: {
    1: '\\left|${args[0]}\\right|'
  },
  add: {
    2: "\\left(${args[0]}".concat(latexOperators.add, "${args[1]}\\right)")
  },
  cbrt: {
    1: '\\sqrt[3]{${args[0]}}'
  },
  ceil: {
    1: '\\left\\lceil${args[0]}\\right\\rceil'
  },
  cube: {
    1: '\\left(${args[0]}\\right)^3'
  },
  divide: {
    2: '\\frac{${args[0]}}{${args[1]}}'
  },
  dotDivide: {
    2: "\\left(${args[0]}".concat(latexOperators.dotDivide, "${args[1]}\\right)")
  },
  dotMultiply: {
    2: "\\left(${args[0]}".concat(latexOperators.dotMultiply, "${args[1]}\\right)")
  },
  dotPow: {
    2: "\\left(${args[0]}".concat(latexOperators.dotPow, "${args[1]}\\right)")
  },
  exp: {
    1: '\\exp\\left(${args[0]}\\right)'
  },
  expm1: "\\left(e".concat(latexOperators.pow, "{${args[0]}}-1\\right)"),
  fix: {
    1: '\\mathrm{${name}}\\left(${args[0]}\\right)'
  },
  floor: {
    1: '\\left\\lfloor${args[0]}\\right\\rfloor'
  },
  gcd: '\\gcd\\left(${args}\\right)',
  hypot: '\\hypot\\left(${args}\\right)',
  log: {
    1: '\\ln\\left(${args[0]}\\right)',
    2: '\\log_{${args[1]}}\\left(${args[0]}\\right)'
  },
  log10: {
    1: '\\log_{10}\\left(${args[0]}\\right)'
  },
  log1p: {
    1: '\\ln\\left(${args[0]}+1\\right)',
    2: '\\log_{${args[1]}}\\left(${args[0]}+1\\right)'
  },
  log2: '\\log_{2}\\left(${args[0]}\\right)',
  mod: {
    2: "\\left(${args[0]}".concat(latexOperators.mod, "${args[1]}\\right)")
  },
  multiply: {
    2: "\\left(${args[0]}".concat(latexOperators.multiply, "${args[1]}\\right)")
  },
  norm: {
    1: '\\left\\|${args[0]}\\right\\|',
    2: undefined // use default template
  },

  nthRoot: {
    2: '\\sqrt[${args[1]}]{${args[0]}}'
  },
  nthRoots: {
    2: '\\{y : $y^{args[1]} = {${args[0]}}\\}'
  },
  pow: {
    2: "\\left(${args[0]}\\right)".concat(latexOperators.pow, "{${args[1]}}")
  },
  round: {
    1: '\\left\\lfloor${args[0]}\\right\\rceil',
    2: undefined // use default template
  },

  sign: {
    1: '\\mathrm{${name}}\\left(${args[0]}\\right)'
  },
  sqrt: {
    1: '\\sqrt{${args[0]}}'
  },
  square: {
    1: '\\left(${args[0]}\\right)^2'
  },
  subtract: {
    2: "\\left(${args[0]}".concat(latexOperators.subtract, "${args[1]}\\right)")
  },
  unaryMinus: {
    1: "".concat(latexOperators.unaryMinus, "\\left(${args[0]}\\right)")
  },
  unaryPlus: {
    1: "".concat(latexOperators.unaryPlus, "\\left(${args[0]}\\right)")
  },
  // bitwise
  bitAnd: {
    2: "\\left(${args[0]}".concat(latexOperators.bitAnd, "${args[1]}\\right)")
  },
  bitNot: {
    1: latexOperators.bitNot + '\\left(${args[0]}\\right)'
  },
  bitOr: {
    2: "\\left(${args[0]}".concat(latexOperators.bitOr, "${args[1]}\\right)")
  },
  bitXor: {
    2: "\\left(${args[0]}".concat(latexOperators.bitXor, "${args[1]}\\right)")
  },
  leftShift: {
    2: "\\left(${args[0]}".concat(latexOperators.leftShift, "${args[1]}\\right)")
  },
  rightArithShift: {
    2: "\\left(${args[0]}".concat(latexOperators.rightArithShift, "${args[1]}\\right)")
  },
  rightLogShift: {
    2: "\\left(${args[0]}".concat(latexOperators.rightLogShift, "${args[1]}\\right)")
  },
  // combinatorics
  bellNumbers: {
    1: '\\mathrm{B}_{${args[0]}}'
  },
  catalan: {
    1: '\\mathrm{C}_{${args[0]}}'
  },
  stirlingS2: {
    2: '\\mathrm{S}\\left(${args}\\right)'
  },
  // complex
  arg: {
    1: '\\arg\\left(${args[0]}\\right)'
  },
  conj: {
    1: '\\left(${args[0]}\\right)^*'
  },
  im: {
    1: '\\Im\\left\\lbrace${args[0]}\\right\\rbrace'
  },
  re: {
    1: '\\Re\\left\\lbrace${args[0]}\\right\\rbrace'
  },
  // logical
  and: {
    2: "\\left(${args[0]}".concat(latexOperators.and, "${args[1]}\\right)")
  },
  not: {
    1: latexOperators.not + '\\left(${args[0]}\\right)'
  },
  or: {
    2: "\\left(${args[0]}".concat(latexOperators.or, "${args[1]}\\right)")
  },
  xor: {
    2: "\\left(${args[0]}".concat(latexOperators.xor, "${args[1]}\\right)")
  },
  // matrix
  cross: {
    2: '\\left(${args[0]}\\right)\\times\\left(${args[1]}\\right)'
  },
  ctranspose: {
    1: "\\left(${args[0]}\\right)".concat(latexOperators.ctranspose)
  },
  det: {
    1: '\\det\\left(${args[0]}\\right)'
  },
  dot: {
    2: '\\left(${args[0]}\\cdot${args[1]}\\right)'
  },
  expm: {
    1: '\\exp\\left(${args[0]}\\right)'
  },
  inv: {
    1: '\\left(${args[0]}\\right)^{-1}'
  },
  pinv: {
    1: '\\left(${args[0]}\\right)^{+}'
  },
  sqrtm: {
    1: "{${args[0]}}".concat(latexOperators.pow, "{\\frac{1}{2}}")
  },
  trace: {
    1: '\\mathrm{tr}\\left(${args[0]}\\right)'
  },
  transpose: {
    1: "\\left(${args[0]}\\right)".concat(latexOperators.transpose)
  },
  // probability
  combinations: {
    2: '\\binom{${args[0]}}{${args[1]}}'
  },
  combinationsWithRep: {
    2: '\\left(\\!\\!{\\binom{${args[0]}}{${args[1]}}}\\!\\!\\right)'
  },
  factorial: {
    1: "\\left(${args[0]}\\right)".concat(latexOperators.factorial)
  },
  gamma: {
    1: '\\Gamma\\left(${args[0]}\\right)'
  },
  lgamma: {
    1: '\\ln\\Gamma\\left(${args[0]}\\right)'
  },
  // relational
  equal: {
    2: "\\left(${args[0]}".concat(latexOperators.equal, "${args[1]}\\right)")
  },
  larger: {
    2: "\\left(${args[0]}".concat(latexOperators.larger, "${args[1]}\\right)")
  },
  largerEq: {
    2: "\\left(${args[0]}".concat(latexOperators.largerEq, "${args[1]}\\right)")
  },
  smaller: {
    2: "\\left(${args[0]}".concat(latexOperators.smaller, "${args[1]}\\right)")
  },
  smallerEq: {
    2: "\\left(${args[0]}".concat(latexOperators.smallerEq, "${args[1]}\\right)")
  },
  unequal: {
    2: "\\left(${args[0]}".concat(latexOperators.unequal, "${args[1]}\\right)")
  },
  // special
  erf: {
    1: 'erf\\left(${args[0]}\\right)'
  },
  // statistics
  max: '\\max\\left(${args}\\right)',
  min: '\\min\\left(${args}\\right)',
  variance: '\\mathrm{Var}\\left(${args}\\right)',
  // trigonometry
  acos: {
    1: '\\cos^{-1}\\left(${args[0]}\\right)'
  },
  acosh: {
    1: '\\cosh^{-1}\\left(${args[0]}\\right)'
  },
  acot: {
    1: '\\cot^{-1}\\left(${args[0]}\\right)'
  },
  acoth: {
    1: '\\coth^{-1}\\left(${args[0]}\\right)'
  },
  acsc: {
    1: '\\csc^{-1}\\left(${args[0]}\\right)'
  },
  acsch: {
    1: '\\mathrm{csch}^{-1}\\left(${args[0]}\\right)'
  },
  asec: {
    1: '\\sec^{-1}\\left(${args[0]}\\right)'
  },
  asech: {
    1: '\\mathrm{sech}^{-1}\\left(${args[0]}\\right)'
  },
  asin: {
    1: '\\sin^{-1}\\left(${args[0]}\\right)'
  },
  asinh: {
    1: '\\sinh^{-1}\\left(${args[0]}\\right)'
  },
  atan: {
    1: '\\tan^{-1}\\left(${args[0]}\\right)'
  },
  atan2: {
    2: '\\mathrm{atan2}\\left(${args}\\right)'
  },
  atanh: {
    1: '\\tanh^{-1}\\left(${args[0]}\\right)'
  },
  cos: {
    1: '\\cos\\left(${args[0]}\\right)'
  },
  cosh: {
    1: '\\cosh\\left(${args[0]}\\right)'
  },
  cot: {
    1: '\\cot\\left(${args[0]}\\right)'
  },
  coth: {
    1: '\\coth\\left(${args[0]}\\right)'
  },
  csc: {
    1: '\\csc\\left(${args[0]}\\right)'
  },
  csch: {
    1: '\\mathrm{csch}\\left(${args[0]}\\right)'
  },
  sec: {
    1: '\\sec\\left(${args[0]}\\right)'
  },
  sech: {
    1: '\\mathrm{sech}\\left(${args[0]}\\right)'
  },
  sin: {
    1: '\\sin\\left(${args[0]}\\right)'
  },
  sinh: {
    1: '\\sinh\\left(${args[0]}\\right)'
  },
  tan: {
    1: '\\tan\\left(${args[0]}\\right)'
  },
  tanh: {
    1: '\\tanh\\left(${args[0]}\\right)'
  },
  // unit
  to: {
    2: "\\left(${args[0]}".concat(latexOperators.to, "${args[1]}\\right)")
  },
  // utils
  numeric: function numeric(node, options) {
    // Not sure if this is strictly right but should work correctly for the vast majority of use cases.
    return node.args[0].toTex();
  },
  // type
  number: {
    0: '0',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)${args[1]}\\right)'
  },
  string: {
    0: '\\mathtt{""}',
    1: '\\mathrm{string}\\left(${args[0]}\\right)'
  },
  bignumber: {
    0: '0',
    1: '\\left(${args[0]}\\right)'
  },
  complex: {
    0: '0',
    1: '\\left(${args[0]}\\right)',
    2: "\\left(\\left(${args[0]}\\right)+".concat(latexSymbols.i, "\\cdot\\left(${args[1]}\\right)\\right)")
  },
  matrix: {
    0: '\\begin{bmatrix}\\end{bmatrix}',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(${args[0]}\\right)'
  },
  sparse: {
    0: '\\begin{bsparse}\\end{bsparse}',
    1: '\\left(${args[0]}\\right)'
  },
  unit: {
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)${args[1]}\\right)'
  }
};
export var defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)';
var latexUnits = {
  deg: '^\\circ'
};
export function escapeLatex(string) {
  return escapeLatexLib(string, {
    preserveFormatting: true
  });
}

// @param {string} name
// @param {boolean} isUnit
export function toSymbol(name, isUnit) {
  isUnit = typeof isUnit === 'undefined' ? false : isUnit;
  if (isUnit) {
    if (hasOwnProperty(latexUnits, name)) {
      return latexUnits[name];
    }
    return '\\mathrm{' + escapeLatex(name) + '}';
  }
  if (hasOwnProperty(latexSymbols, name)) {
    return latexSymbols[name];
  }
  return escapeLatex(name);
}
;