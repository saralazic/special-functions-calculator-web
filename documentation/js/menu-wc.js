'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">spef-calculator documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-6756fbe2dafc684f0e98531ff8d848b7dd78ceb1b273d1ae26c0558758d70ecbc906cfd11370370a814813eda53e843acc3f43d8a9970a1ecb748ad9c986926b"' : 'data-bs-target="#xs-components-links-module-AppModule-6756fbe2dafc684f0e98531ff8d848b7dd78ceb1b273d1ae26c0558758d70ecbc906cfd11370370a814813eda53e843acc3f43d8a9970a1ecb748ad9c986926b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6756fbe2dafc684f0e98531ff8d848b7dd78ceb1b273d1ae26c0558758d70ecbc906cfd11370370a814813eda53e843acc3f43d8a9970a1ecb748ad9c986926b"' :
                                            'id="xs-components-links-module-AppModule-6756fbe2dafc684f0e98531ff8d848b7dd78ceb1b273d1ae26c0558758d70ecbc906cfd11370370a814813eda53e843acc3f43d8a9970a1ecb748ad9c986926b"' }>
                                            <li class="link">
                                                <a href="components/AboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalculatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalculatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FunctionInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FunctionInformationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FunctionInputComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FunctionInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomepageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomepageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultDisplayComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpecialFunctionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpecialFunctionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SvgIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SvgIconComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BesselFirstKind.html" data-type="entity-link" >BesselFirstKind</a>
                            </li>
                            <li class="link">
                                <a href="classes/BesselSecondKind.html" data-type="entity-link" >BesselSecondKind</a>
                            </li>
                            <li class="link">
                                <a href="classes/BIG_NUMBER_CONSTANTS.html" data-type="entity-link" >BIG_NUMBER_CONSTANTS</a>
                            </li>
                            <li class="link">
                                <a href="classes/CalculatorService.html" data-type="entity-link" >CalculatorService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChebyshevPolynomialOfFirstKind.html" data-type="entity-link" >ChebyshevPolynomialOfFirstKind</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChebyshevPolynomialOfSecondKind.html" data-type="entity-link" >ChebyshevPolynomialOfSecondKind</a>
                            </li>
                            <li class="link">
                                <a href="classes/HermitePhysicist.html" data-type="entity-link" >HermitePhysicist</a>
                            </li>
                            <li class="link">
                                <a href="classes/HermiteProbabilistic.html" data-type="entity-link" >HermiteProbabilistic</a>
                            </li>
                            <li class="link">
                                <a href="classes/JacobiPolynomial.html" data-type="entity-link" >JacobiPolynomial</a>
                            </li>
                            <li class="link">
                                <a href="classes/LaguerrePolynomial.html" data-type="entity-link" >LaguerrePolynomial</a>
                            </li>
                            <li class="link">
                                <a href="classes/LegendrePolynomial.html" data-type="entity-link" >LegendrePolynomial</a>
                            </li>
                            <li class="link">
                                <a href="classes/SpecialFunction.html" data-type="entity-link" >SpecialFunction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stack.html" data-type="entity-link" >Stack</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/LanguageService.html" data-type="entity-link" >LanguageService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FunctionParams.html" data-type="entity-link" >FunctionParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FunctionParamsForCalculation.html" data-type="entity-link" >FunctionParamsForCalculation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FunctionParamsForCalculationWithBigNumbers.html" data-type="entity-link" >FunctionParamsForCalculationWithBigNumbers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExpression.html" data-type="entity-link" >IExpression</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInput.html" data-type="entity-link" >IInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOperatorPriority.html" data-type="entity-link" >IOperatorPriority</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISpecialFunctionTranslations.html" data-type="entity-link" >ISpecialFunctionTranslations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISymbol.html" data-type="entity-link" >ISymbol</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});