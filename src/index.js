import React from 'react';
import T from 'prop-types';
import addons from '@storybook/addons';
import {
  ADDON_EVENT_CHANGE,
  ADDON_EVENT_RESET,
} from './constants';

export class Store {
  constructor(initialState) {
    this.initialState = Object.freeze({ ...initialState });
    this.state = this.initialState;
    this.handlers = [];
  }

  set(state) {
    this.state = Object.freeze({ ...this.state, ...state });
    this.fireStateChange();
  }

  reset() {
    if (this.initialState !== this.state) {
      this.state = this.initialState;
      this.fireStateChange();
    }
  }

  subscribe(handler) {
    if (this.handlers.indexOf(handler) < 0) {
      this.handlers.push(handler);
    }
  }

  unsubscribe(handler) {
    const handlerIndex = this.handlers.indexOf(handler);
    if (handlerIndex >= 0) {
      this.handlers.splice(handlerIndex, 1);
    }
  }

  fireStateChange() {
    const state = this.state;

    this.handlers.forEach(handler => handler(state));
  }
}

export class StoryState extends React.Component {
  static propTypes = {
    channel: T.object.isRequired,
    store: T.object.isRequired,
    storyFn: T.func.isRequired,
    context: T.object,
  };

  state = {
    storyState: this.props.store.state,
  };

  componentDidMount() {
    const { store, channel } = this.props;

    store.subscribe(this.handleStateChange);
    channel.on(ADDON_EVENT_RESET, this.handleResetEvent);
    channel.emit(ADDON_EVENT_CHANGE, { state: store.state });
  }

  componentWillUnmount() {
    const { store, channel } = this.props;

    store.unsubscribe(this.handleStateChange);
    channel.removeListener(ADDON_EVENT_RESET, this.handleResetEvent);
    channel.emit(ADDON_EVENT_CHANGE, { state: null });
  }

  handleResetEvent = () => {
    const { store } = this.props;

    store.reset();
  };

  handleStateChange = (storyState) => {
    const { channel } = this.props;

    this.setState({ storyState });
    channel.emit(ADDON_EVENT_CHANGE, { state: storyState });
  };

  render() {
    const { store, storyFn, context } = this.props;

    const child = context ? storyFn(context) : storyFn(store);
    return React.isValidElement(child) ? child : child();
  }
}

export function withState(initialState, storyFn=null) {
  const store = new Store(initialState || {});
  const channel = addons.getChannel();

  if (storyFn) {
    // Support legacy withState signature
    return () => (
      <StoryState store={store} storyFn={storyFn} channel={channel}/>
    );
  } else {
    return (storyFn) => (context) => (
      <StoryState store={store} storyFn={storyFn} channel={channel} context={{...context, store}}/>
    );
  }
}
