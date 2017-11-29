import React from 'react';
import T from 'prop-types';
import addons from '@storybook/addons';
import JsonView from 'react-json-view';

const styles = {
  panel: {
    margin: 10,
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#444',
    width: '100%',
    overflow: 'auto',
  },
  currentState: {
    whiteSpace: 'pre',
  },
  resetButton: {
    position: 'absolute',
    bottom: 11,
    right: 10,
    border: 'none',
    borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px 0 0 0',
    color: 'rgba(0, 0, 0, 0.5)',
    outline: 'none',
  },
};

class StatePanel extends React.Component {
  static propTypes = {
    channel: T.object,
    api: T.object,
  };

  state = {
    storyState: null,
  };

  componentDidMount() {
    const { channel } = this.props;

    channel.on('dump247/state/change', this.handleChangeEvent);
  }

  componentWillUnmount() {
    const { channel } = this.props;

    channel.removeListener('dump247/state/change', this.handleChangeEvent);
  }

  handleChangeEvent = ({ state: storyState }) => {
    this.setState({ storyState });
  };

  handleResetClick = () => {
    const { channel } = this.props;

    channel.emit('dump247/state/reset');
  };

  render() {
    const { storyState } = this.state;

    if (storyState === null) {
      return null;
    }

    return (
      <div style={styles.panel}>
        <JsonView src={storyState} name={null} enableClipboard={false}/>
        <button style={styles.resetButton} type="button" onClick={this.handleResetClick}>Reset</button>
      </div>
    );
  }
}

export function register() {
  addons.register('dump247/state', (api) => {
    const channel = addons.getChannel();

    addons.addPanel('dump247/state/panel', {
      title: 'State',
      render: () => <StatePanel channel={channel} api={api}/>,
    });
  });
}
