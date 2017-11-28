import React from 'react';
import { configure, storiesOf } from '@storybook/react';
import { withState } from '../dist/index';

configure(function () {
  storiesOf('Test')
  .add('with state', withState({ value: '' }, (store) => (
    <input {...store.state} type="text" onChange={({ target: { value } }) => store.set({ value })}/>
  )))
  .add('with state 2', withState({ value: '' }, (store) => (
    <input {...store.state} type="text" onChange={({ target: { value } }) => store.set({ value })}/>
  )))
  .add('no state', () => (
    <div>No stuff</div>
  ));
}, module);
