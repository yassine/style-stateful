import * as React from 'react';

/**
 * A higher-order component that maps the (presentational) component state & props to
 * a CSS state.
 *
 * @param {Constructor<T & React.Component<P, S>>} TargetComponentClass
 * @param styles a class name dictionary (as per css modules)
 * @param {ComponentStateCssMapper<P, S>} mapComponentStateToCssState
 * @returns {Constructor<T & React.Component<P, S>>}
 * @constructor
 */
export function StyleStatefulComponent<T,P,S> (TargetComponentClass: Constructor<T & React.Component<P,S>>,
                                               mapComponentStateToCssState ?: ComponentStateCssMapper<P,S>,
                                               styles?: Dictionary,)
                : Constructor<T & React.Component<P & StyleStatefulProps, S>>

export function StyleStateful<T,P,S> (mapComponentStateToCssState ?: ComponentStateCssMapper<P,S>, styles?: Dictionary)

/**
 *
 * @param {Constructor<T & React.Component<P, S>>} TargetComponentClass
 * @param {ComponentStateCssMapper<P, S>} mapComponentStateToCssState
 * @returns {(cssSheet: {[p: string]: string}) => Constructor<T & React.Component<P, S>>}
 * @constructor
 */
export function StyleStatefulComponentFactory<T,P,S> (TargetComponentClass: Constructor<T & React.Component<P,S>>,
                                                      mapComponentStateToCssState: ComponentStateCssMapper<P,S>)
  : (cssSheet: {[key: string]: string}) => Constructor<T & React.Component<P & StyleStatefulProps, S>>

interface StyleStatefulProps {
  permanentCSSState ?: {[key: string]: boolean | string}
  stylesheet ?: Dictionary
}

declare module 'react' {
  interface HTMLAttributes<T> {
    'css-ref' ?: string;
  }
  interface SVGAttributes<T> {
    'css-ref' ?: string;
  }
}

type ComponentStateCssMapper<P,S> = (props: P, state: S) => { [className: string]: (boolean | string) }

type Constructor<T> = {
  new(...args: any[]): T;
}

interface Dictionary {
  [key: string]: any;
}
