import React from 'react';
import { connect } from 'zus';
import styles from './index.less';

@connect(({ example, loading }) => ({ example, loading }))
class PreviewList extends React.Component {
  render() {
    return (
      <div className={styles.overview}>
        <div className={styles.nav}>页 面</div>
        <ul className={styles.list}>
          <div className={styles.block}>
            <aside className={styles.tools}>1</aside>
            <div className={styles.preview}>1</div>
          </div>
          <div className={styles.block}>
            <aside className={styles.tools}>2</aside>
            <div className={styles.preview}>1</div>
          </div>
          <div className={styles.block}>
            <aside className={styles.tools}>3</aside>
            <div className={styles.preview}>1</div>
          </div>
        </ul>
      </div>
    );
  }
}

export default PreviewList;
