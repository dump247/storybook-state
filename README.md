# Storybook State

An extension for [React Storybook](https://storybook.js.org/) that manages the state of a stateless
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
.add('with check', withState({ checked: false }, (store) => (
  <Checkbox {...store.state}
            label="Test Checkbox"
            onChange={(checked) => store.set({ checked })}/>
));
```

## Store API

### `store.set(state)`

Set the given state keys. The `state` parameter is an object with the keys and values to set.

This only sets/overwrites the specific keys provided.

### `store.reset()`

Reset the store to the initial state.

