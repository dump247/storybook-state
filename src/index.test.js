import React from 'react';
import { withState, Store } from './index';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import addons from '@storybook/addons';

jest.mock('@storybook/addons');

function expectProps(component) {
  const props = component.props();
  return expect(Object.keys(props)
    .filter(k => !k.startsWith('on'))
    .reduce((o, k) => { o[k] = props[k]; return o; }, {})
  );
}

function mockChannel() {
  return { emit: jest.fn(), on: jest.fn(), removeListener: jest.fn() };
}

addons.getChannel.mockReturnValue(mockChannel());

configure({ adapter: new Adapter() });

describe('Store', () => {
  test('constructor initializes state', () => {
    const store = new Store({ var1: 'value 1' });

    expect(store.state).toEqual({ var1: 'value 1' });
  });

  test('state is immutable', () => {
    const store = new Store({ var1: 'value 1' });

    store.var1 = 'value 2';
    expect(store.state).toEqual({ var1: 'value 1' });
  });

  test('set and reset', () => {
    const store = new Store({ var1: 'value 1' });

    store.set({ var2: 'value 2' });
    expect(store.state).toEqual({ var1: 'value 1', var2: 'value 2' });

    store.set({ var1: 'value 3' });
    expect(store.state).toEqual({ var1: 'value 3', var2: 'value 2' });

    store.set({ var1: 'value 4', var2: 'value 5', var3: 'value 6' });
    expect(store.state).toEqual({ var1: 'value 4', var2: 'value 5', var3: 'value 6' });

    store.reset();
    expect(store.state).toEqual({ var1: 'value 1' });
  });

  test('subscribe and unsubscribe', () => {
    const handler = jest.fn();
    const store = new Store({ var1: 'value 1' });
    store.subscribe(handler);

    store.set({ var1: 'value 2' });
    expect(handler.mock.calls[0][0]).toEqual({ var1: 'value 2' });

    store.reset();
    expect(handler.mock.calls[1][0]).toEqual({ var1: 'value 1' });

    // Second reset does nothing
    store.reset();
    expect(handler.mock.calls.length).toBe(2);

    store.unsubscribe(handler);
    store.set({ var1: 'value 3' });
    expect(handler.mock.calls.length).toBe(2);
    expect(store.state).toEqual({ var1: 'value 3' });
  });
});

describe('withState', () => {
  const TestComponent = (props) => {
    return (
      <div>
        <button id="setvar1" onClick={props.onSetVar1}>Set var1</button>
        <button id="setvar2" onClick={props.onSetVar2}>Set var2</button>
        <button id="reset" onClick={props.onReset}>Reset</button>
      </div>
    );
  };

  test('legacy signature', () => {
    const stateComponent = mount(withState({ var1: 1 }, (store) => <TestComponent {...store.state}/>)());
    const testComponent = stateComponent.childAt(0);
    expect(testComponent.props()).toEqual({ var1: 1 });
  });

  test('initial state is passed to component', () => {
    const stateComponent = mount(withState({ var1: 1 })(({ store }) => <TestComponent {...store.state}/>)({}));
    const testComponent = stateComponent.childAt(0);
    expect(testComponent.props()).toEqual({ var1: 1 });
  });

  test('set existing state variable', () => {
    const stateComponent = mount(withState({ var1: 1 })(({ store }) => (
      <TestComponent {...store.state} onSetVar1={() => store.set({ var1: 2 })}/>
    ))({}));

    expectProps(stateComponent.childAt(0)).toEqual({ var1: 1 });

    stateComponent.childAt(0).find('#setvar1').simulate('click');

    expectProps(stateComponent.childAt(0)).toEqual({ var1: 2 });
  });

  test('set new state variable', () => {
    const stateComponent = mount(withState({ var1: 1 })(({ store }) => (
      <TestComponent {...store.state} onSetVar2={() => store.set({ var2: 3 })}/>
    ))({}));

    expectProps(stateComponent.childAt(0)).toEqual({ var1: 1 });

    stateComponent.childAt(0).find('#setvar2').simulate('click');

    expectProps(stateComponent.childAt(0)).toEqual({ var1: 1, var2: 3 });
  });

  test('reset to initial state', () => {
    const stateComponent = mount(withState({ var1: 1 })(({ store }) => (
      <TestComponent {...store.state}
                     onSetVar2={() => store.set({ var2: 3 })}
                     onSetVar1={() => store.set({ var1: 2 })}
                     onReset={() => store.reset()}/>
    ))({}));

    expect(stateComponent.childAt(0).props()).toMatchObject({ var1: 1 });

    stateComponent.childAt(0).find('#setvar1').simulate('click');
    stateComponent.childAt(0).find('#setvar2').simulate('click');

    expectProps(stateComponent.childAt(0)).toEqual({ var1: 2, var2: 3 });

    stateComponent.childAt(0).find('#reset').simulate('click');

    expectProps(stateComponent.childAt(0)).toEqual({ var1: 1 });
  });

  test('unmount state component', () => {
    const stateComponent = mount(withState({ var1: 1 })((store) => <TestComponent {...store.state}/>)({}));
    stateComponent.unmount();
  })
});
