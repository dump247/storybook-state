import React from 'react';
import { configure, storiesOf } from '@storybook/react';
import { withState } from '../dist/index';
import { withInfo } from '@storybook/addon-info';

const Input = (props) => {
  return <input {...props.store.state} type="text" onChange={({ target: { value } }) => props.store.set({ value })}/>;
};

configure(function () {
  storiesOf('Test', module)
  .add('with state', withState({ value: '' }, (store) => <Input store={store}/>))
  .add('with state 2', withState({ value: '' }, (store) => <Input store={store}/>))
  .add('no state', () => <div>No stuff</div>)
  .add('chain', withState({ value: '' })(({ store }) => <Input store={store}/>))
  .add('chain withInfo before',
      withInfo('some info')(withState({ value: '' })(({ store }) => <Input store={store}/>))
  )
  .add('chain withInfo after',
      withState({ value: '' })(withInfo('some info')(({ store }) => <Input store={store}/>))
  );
}, module);
