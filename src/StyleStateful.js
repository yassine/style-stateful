import * as React from 'react';

const ATTRIBUTE_NAME = 'css-ref';
const TARGET_ATTRIBUTE_NAME = 'css-target-attribute';
const DEFAULT_TARGET_ATTRIBUTE_NAME = 'className';


/**
 * Return a HoC adding css state mapping.
 */
export function StyleStatefulComponentFactory(TargetComponentClass, mapComponentStateToCssState, classNameStateMapper = defaultClassStateMapper)
{
  return (styles) => class StyleStatefulComponent extends TargetComponentClass {

      static displayName = `CssStatefulComponent<${TargetComponentClass['displayName'] || TargetComponentClass['name']}>`;
      static $$StyleStatefulComponent = true;

      render() {
        const cssState  = Object.assign({}, mapComponentStateToCssState(this.props, this.state), this.props.permanentCSSState);
        const cssStates = Object.keys(cssState)
          .filter(key => !!cssState[key])
          .map(key => typeof cssState[key] === 'string' ? cssState[key] : key);
        return recursiveReplace(super.render(), (className) => getFullClassName(styles, className, classNameStateMapper, cssStates));
      }

    };
}

export function StyleStateful(mapper = defaultMapper, styles = {}){
  return function(Component){
    return StyleStatefulComponent(Component, mapper, styles);
  }
}

export function StyleStatefulComponent(TargetComponentClass, mapComponentStateToCssState = defaultMapper, styles = {}, classNameStateMapper = defaultClassStateMapper){
  return StyleStatefulComponentFactory(TargetComponentClass, mapComponentStateToCssState, classNameStateMapper)(styles);
}

// utilities

function getFullClassName(styles, className, classNameStateMapper, cssStates = []){
  return cssStates.map((state) => styles[classNameStateMapper(className, state)] || classNameStateMapper(className, state) || '')
            .reduce((previous, current) => `${previous} ${current}`, styles[className] || className || '');
}

/**
 * based on B.E.M convention, state maps to a 'modifier' of the css class
 */
function defaultClassStateMapper(className, stateName){
  return `${className}--${stateName}`;
}
function defaultMapper() {
  return {};
}
function recursiveReplace(element, getFullClassName){
  if(element && element.type && element.type instanceof Function){
    //found react element root, it's useless to move deeper
    return element;
  }
  if(React.isValidElement(element) && element.props[ATTRIBUTE_NAME]){
    const target = element.props[TARGET_ATTRIBUTE_NAME] || DEFAULT_TARGET_ATTRIBUTE_NAME,
          cssClasses = (element.props[ATTRIBUTE_NAME] || '').trim().split(/\s+/) || '',
          newProps = {...element.props},
          writableElement = Object.assign({}, element),
          newChildren = mapChildren(element.props.children, (child)=>recursiveReplace(child, getFullClassName));
    writableElement.props = newProps;

    newProps[target] =  cssClasses
      .map( (className) => `${getFullClassName(className)} ${element.props.className || ''} ${getFullClassName(element.props.className) || ''}`.trim() )
      .reduce( (previous, current) => `${current} ${previous}`, '' )
      .trim();

    delete newProps[ATTRIBUTE_NAME];
    delete newProps[TARGET_ATTRIBUTE_NAME];
    return React.cloneElement(writableElement, newProps, newChildren);

  }else if(React.isValidElement(element)){
    let children = element.props.children;
    if(children){
      children = mapChildren(children, (child)=>recursiveReplace(child, getFullClassName));
    }
    return React.cloneElement(element, element.props, children);
  }else{
    return element;
  }
}

function mapChildren(children, transformFn){
  if(children instanceof Array){
    return React.Children.map(children, transformFn);
  }else if(React.isValidElement(children)){
    return transformFn(children);
  }else if(children instanceof Function){
    return (...args) => {
      return React.Children.map(children(...args), transformFn);
    }
  }
  return children;
}
