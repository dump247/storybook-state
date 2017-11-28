import React from 'react';
import T from 'prop-types';
import addons from '@storybook/addons';

class Store {
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

class StoryState extends React.Component {
  static propTypes = {
    channel: T.object.isRequired,
    store: T.object.isRequired,
    storyFn: T.func.isRequired,
  };

  state = {
    storyState: this.props.store.state,
  };

  componentDidMount() {
    const { store, channel } = this.props;

    store.subscribe(this.handleStateChange);
    channel.on('dump247/state/reset', this.handleResetEvent);
    channel.emit('dump247/state/change', store.state);
  }

  componentWillUnmount() {
    const { store, channel } = this.props;

    store.unsubscribe(this.handleStateChange);
    channel.removeListener('dump247/state/reset', this.handleResetEvent);
  }

  handleResetEvent = () => {
    const { store } = this.props;

    store.reset();
  };

  handleStateChange = (storyState) => {
    const { channel } = this.props;

    this.setState({ storyState });
    channel.emit('dump247/state/change', storyState);
  };

  render() {
    const { store, storyFn } = this.props;

    return storyFn(store);
  }
}

export function withState(initialState, storyFn) {
  const store = new Store(initialState || {});
  const channel = addons.getChannel();

  return () => <StoryState store={store} storyFn={storyFn} channel={channel}/>;
}
