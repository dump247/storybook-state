import React from 'react';
import { withState } from './index';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

const TestComponent = (props) => {
  return (
    <div>
      <button id="setvar1" onClick={props.onSetVar1}>Set var1</button>
      <button id="setvar2" onClick={props.onSetVar2}>Set var2</button>
      <button id="reset" onClick={props.onReset}>Reset</button>
    </div>
  );
};

test('initial state is passed to component', () => {
  const stateComponent = mount(withState({ var1: 1 }, (store) => <TestComponent {...store.state}/>)());
  const testComponent = stateComponent.childAt(0);
  expect(testComponent.props()).toEqual({ var1: 1 });
});

test('set existing state variable', () => {
  const stateComponent = mount(withState({ var1: 1 }, (store) => (
    <TestComponent {...store.state} onSetVar1={() => store.set({ var1: 2 })}/>
  ))());

  expectProps(stateComponent.childAt(0)).toEqual({ var1: 1 });

  stateComponent.childAt(0).find('#setvar1').simulate('click');

  expectProps(stateComponent.childAt(0)).toEqual({ var1: 2 });
});

test('set new state variable', () => {
  const stateComponent = mount(withState({ var1: 1 }, (store) => (
    <TestComponent {...store.state} onSetVar2={() => store.set({ var2: 3 })}/>
  ))());

  expectProps(stateComponent.childAt(0)).toEqual({ var1: 1 });

  stateComponent.childAt(0).find('#setvar2').simulate('click');

  expectProps(stateComponent.childAt(0)).toEqual({ var1: 1, var2: 3 });
});

test('reset to initial state', () => {
  const stateComponent = mount(withState({ var1: 1 }, (store) => (
    <TestComponent {...store.state}
                   onSetVar2={() => store.set({ var2: 3 })}
                   onSetVar1={() => store.set({ var1: 2 })}
                   onReset={() => store.reset()}/>
  ))());

  expect(stateComponent.childAt(0).props()).toMatchObject({ var1: 1 });

  stateComponent.childAt(0).find('#setvar1').simulate('click');
  stateComponent.childAt(0).find('#setvar2').simulate('click');

  expectProps(stateComponent.childAt(0)).toEqual({ var1: 2, var2: 3 });

  stateComponent.childAt(0).find('#reset').simulate('click');

  expectProps(stateComponent.childAt(0)).toEqual({ var1: 1 });
});

test('unmount state component', () => {
  const stateComponent = mount(withState({ var1: 1 }, (store) => <TestComponent {...store.state}/>)());
  stateComponent.unmount();
});

function expectProps(component) {
  const props = component.props();
  return expect(Object.keys(props)
    .filter(k => !k.startsWith('on'))
    .reduce((o, k) => { o[k] = props[k]; return o; }, {})
  );
}
