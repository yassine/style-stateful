# style-stateful
![Build Status](https://www.travis-ci.org/yassine/style-stateful.svg?branch=master)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?metric=alert_status&project=com.github.yassine%3Astyle-stateful)](https://sonarcloud.io/dashboard/index/com.github.yassine:soxy-chains-ui)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?metric=sqale_rating&project=com.github.yassine%3Astyle-stateful)](https://sonarcloud.io/dashboard/index/com.github.yassine:soxy-chains-ui)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?metric=reliability_rating&project=com.github.yassine%3Astyle-stateful)](https://sonarcloud.io/dashboard/index/com.github.yassine:soxy-chains-ui)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?metric=coverage&project=com.github.yassine%3Astyle-stateful)](https://sonarcloud.io/dashboard/index/com.github.yassine:soxy-chains-ui)

A React higher-order component encapsulating style states

### Rationale

When developing a Presentational component, often we have to deal with the mechanism by which
our component would translate its props/state into a set of css style. The goal of the 
``StyleStateful`` hoc is to isolate that mechanism into a reducer like function that would map
the state and props of the component into a set of CSS states.

### Example
Consider the following component:
```
@StyleStateful(mapPropsToStyleState)
class MyFancyInput extends React.Component {
  render () {
    return <div css-ref = 'fancy__wrap'>
      <label css-ref = 'fancy__label' >Name</label>
      <input css-ref = 'fancy__input' type = 'text' value = {this.props.value}/>
    </div>,
  }
}

//Here is our mapper
function mapPropsToStyleState(props, state) {
  return {
    'highlight' : props.isHightlighted,
    'valid'     : !!props.value,
    'invalid'   : !props.value
  }
}

```
Let's say the component can have many css states such as : valid, invalid and highlighted.
By using the Hoc (configured with the appropriate mapper as per the example), the 
resulting markup of the following component 
``<MyFancyInput value = 'Hello World!' isHightlighted = { true }/>`` 
would be :
```
<div class = 'fancy__wrap fancy__wrap--isHightlighted fancy__wrap--valid'>
  <label class = 'fancy__label fancy__label--isHightlighted fancy__label--valid' >Name</label>
  <input class = 'fancy__input fancy__input--isHightlighted fancy__input--valid' type = 'text' value = 'Hello World!'/>
</div>
``` 
