# Storybook State

An extension for [Storybook](https://storybook.js.org/) that manages the state of a stateless
component. This makes it easier to write stories for stateless components.

## Getting Started

### Add @dump247/storybook

```sh
npm install --save-dev @dump247/storybook-state
```

Register the extension in `addons.js`.

```javascript
import '@dump247/storybook-state/register';
```

### Create a Story

Use the extension to create a story.

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withState } from '@dump247/storybook-state';

storiesOf('Checkbox', module)
.add('with check', withState({ checked: false })(({ store }) => (
  <Checkbox {...store.state}
            label="Test Checkbox"
            onChange={(checked) => store.set({ checked })}/>
));
```

## Extension

### `withState(initialState)(storyFn)`

`initialState` is the initial state of the component. This is an object where each key is a
state value to set.

`storyFn` is the function that produces the story component. This function receives the story context
object `{ store: Store }` as the parameter.

This extension can be composed with other storybook extension functions:

```javascript
withState({ initialState: '' })(
    withInfo(`Some cool info`)(
        ({ store }) => <MyComponent {...store.state}/>
    )
)
```


## Store API

### `store.state`

Object that contains the current state.

### `store.set(state)`

Set the given state keys. The `state` parameter is an object with the keys and values to set.

This only sets/overwrites the specific keys provided.

### `store.reset()`

Reset the store to the initial state.

## Panel

This project includes a storybook panel that displays the current state and allows
for resetting the state.

![Panel Screenshot](panel-screenshot.png?raw=true&v=2 "Panel")
