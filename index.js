import React from 'react';
import T from 'prop-types';
import uuid from 'uuid/v4';

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
    const subscriptionId = uuid();

    this.handlers.push({ handler, subscriptionId });

    return subscriptionId;
  }

  unsubscribe(subscriptionId) {
    for (const [index, { subscriptionId: handlerId }] of this.handlers.entries()) {
      if (handlerId === subscriptionId) {
        this.handlers.splice(index, 1);
        break;
      }
    }
  }

  fireStateChange() {
    const state = this.state;

    this.handlers.forEach(({ handler }) => handler(state));
  }
}

class StoryState extends React.Component {
  static propTypes = {
    store: T.object.isRequired,
    storyFn: T.func.isRequired,
  };

  state = {
    storyState: this.props.store.state,
  };

  componentDidMount() {
    const { store } = this.props;

    this.subscriptionId = store.subscribe((storyState) => this.setState({ storyState }));
  }

  componentWillUnmount() {
    const { store } = this.props;

    store.unsubscribe(this.subscriptionId);
  }

  render() {
    const { store, storyFn } = this.props;

    return storyFn(store);
  }
}

export function withState(initialState, storyFn) {
  const store = new Store(initialState || {});

  return () => <StoryState store={store} storyFn={storyFn}/>;
}
