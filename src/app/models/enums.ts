export enum FunctionType {
  BESSEL_FIRST_KIND = 'bessel1',
  BESSEL_SECOND_KIND = 'bessel2',
  BESSEL_THIRD_KIND = 'bessel3',
  LAGUERRE_POLYNOMIAL = 'laguerre',
  LEGENDRE_POLYNOMIAL = 'legendre',
  JACOBI_POLYNOMIAL = 'jacobi',
  CHEBYSHEV_FIRST_KIND = 'chebyshev1',
  CHEBYSHEV_SECOND_KIND = 'chebyshev2',
  HERMITE_PHYSICIST = 'hermite1',
}

export enum InputType {
  VARIABLE,
  PRECISION,
  ORDER,
  ALPHA,
  BETA,
}

export enum Keys {
  BACKSPACE = 'Backspace',
  ENTER = 'Enter',
  ESC = 'Escape',
  DOT = '.',
  BRACKET_OPEN = '(',
  BRACKET_CLOSED = ')',
  PERCENT = '%',
  STAR = '*',
}
