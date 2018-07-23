import * as React from 'react';
import { expect } from 'chai';
import { configure, mount } from 'enzyme';
import { StyleStatefulComponent, StyleStatefulComponentFactory, StyleStateful } from './StyleStateful';

const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

const className = `test-class`;

class MyTestComponentA extends React.Component<{addCssState ?: boolean}, any> {
  render () {
    return <div css-ref={className}>
      <span>Hello</span>
      <ul>
        <li css-ref = {className}>Test</li>
      </ul>
    </div>;
  }
}

class MyTestComponentB extends React.Component<{addCssState ?: boolean}, any> {
  render () {
    return <div css-ref={className}>
      <div>
        {this.props.children}
      </div>
    </div>
  }
}

const StyleMapA = {
  'test-class' : `${className}-0000`,
  'test-class--some-modifier' : `${className}-0000--some-modifier`
};

const StyleMapB = {
  'test-class' : `${className}-1111`,
  'test-class--some-modifier' : `${className}-1111--some-modifier`
};

function PropsMapper (props: {addCssState: boolean}) {
  return {
    'some-modifier': props.addCssState
  }
}

@StyleStateful(StyleMapA, PropsMapper)
class MyHoCComponentD extends MyTestComponentA {}
@StyleStateful(StyleMapA)
class MyHoCComponentE extends MyTestComponentA {}

const MyHoCComponentA = StyleStatefulComponent(MyTestComponentA, StyleMapA, PropsMapper);
const MyHoCComponentB = StyleStatefulComponent(MyTestComponentB, StyleMapB, PropsMapper);
const MyHoCComponentC = StyleStatefulComponentFactory(MyTestComponentA, PropsMapper)(StyleMapA);

describe('CssStatefulComponent : Style statefull higher order (presentational) component', function () {

  beforeEach(() => {
    require('jasmine-enzyme')();
  });

  it('it should map correct class names', function () {
    let wrapper = mount(<MyHoCComponentA/>);
    expect(wrapper.find(`.${className}-0000`)).to.have.length(2);
    expect(wrapper.find(`.${className}`)).to.have.length(0);
    expect(wrapper.find('[css-ref]')).to.have.length(0);

    //component obtainer through a component factory
    wrapper = mount(<MyHoCComponentC/>);
    expect(wrapper.find(`.${className}-0000`)).to.have.length(2);
    expect(wrapper.find(`.${className}`)).to.have.length(0);
    expect(wrapper.find('[css-ref]')).to.have.length(0);

    //component obtainer through a decorator
    wrapper = mount(<MyHoCComponentD/>);
    expect(wrapper.find(`.${className}-0000`)).to.have.length(2);
    expect(wrapper.find(`.${className}`)).to.have.length(0);
    expect(wrapper.find('[css-ref]')).to.have.length(0);

    wrapper = mount(<MyHoCComponentE/>);
    expect(wrapper.find(`.${className}`)).to.have.length(0);
    expect(wrapper.find('[css-ref]')).to.have.length(0);
  });

  it('it should map css modifiers to css classes when a given (css) state is active', function () {
    let wrapper = mount(<MyHoCComponentA addCssState = {true}/>);
    expect(wrapper.find(`.${className}-0000`)).to.have.length(2);
    expect(wrapper.find(`.${className}-0000--some-modifier`)).to.have.length(2);
    expect(wrapper.find(`.${className}-0000.${className}-0000--some-modifier`)).to.have.length(2);
    expect(wrapper.find('[css-ref]')).to.have.length(0);

    wrapper = mount(<MyHoCComponentC addCssState = {true}/>);
    expect(wrapper.find(`.${className}-0000`)).to.have.length(2);
    expect(wrapper.find(`.${className}-0000--some-modifier`)).to.have.length(2);
    expect(wrapper.find(`.${className}-0000.${className}-0000--some-modifier`)).to.have.length(2);
    expect(wrapper.find('[css-ref]')).to.have.length(0);

    wrapper = mount(<MyHoCComponentD addCssState = {true}/>);
    expect(wrapper.find(`.${className}-0000`)).to.have.length(2);
    expect(wrapper.find(`.${className}-0000--some-modifier`)).to.have.length(2);
    expect(wrapper.find(`.${className}-0000.${className}-0000--some-modifier`)).to.have.length(2);
    expect(wrapper.find('[css-ref]')).to.have.length(0);

  });

  it('embedded component css state should be isolated from parent ones', function () {
    const wrapper = mount(<MyHoCComponentB>
                                  <MyHoCComponentA addCssState = {true}/>
                                </MyHoCComponentB>);
    expect(wrapper.find(`.${className}-0000`)).to.have.length(2);
    expect(wrapper.find(`.${className}-1111`)).to.have.length(1);
    expect(wrapper.find(`.${className}-0000.${className}-0000--some-modifier`)).to.have.length(2);
    expect(wrapper.find(`.${className}-1111.${className}-1111--some-modifier`)).to.have.length(0);
    expect(wrapper.find('[css-ref]')).to.have.length(0);
  });

});
