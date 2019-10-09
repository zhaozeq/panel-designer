import React from 'react';
import { connect } from 'zus';
import PreviewList from './PreviewList';
import PanelDraw from './PanelDraw';
import ComponentList from './components/ComponentList';
import styles from './index.less';

@connect(({ home, loading }) => ({ home, loading }))
class Home extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    setTimeout(() => {
      dispatch({
        type: 'example/query',
        payload: { a: 1 },
      });
    }, 1000);
  }

  render() {
    const { home, dispatch } = this.props;
    const { openAction } = home;
    const componentListProps = {
      visible: openAction === 'component',
      getContainer: false,
      onClose() {
        dispatch({ type: 'home/updateState', payload: { openAction: null } });
      },
    };
    return (
      <main className={`${styles.main} main`}>
        <PreviewList />
        <PanelDraw />
        <ComponentList {...componentListProps} />
      </main>
    );
  }
}

export default Home;
