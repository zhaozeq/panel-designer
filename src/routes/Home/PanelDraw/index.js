import React from 'react';
import { connect } from 'zus';
import Draggable from '@components/Draggable';
import styles from './index.less';

@connect(({ example, loading }) => ({ example, loading }))
class PanelDraw extends React.Component {
  render() {
    return (
      <section className={styles.panel}>
        <div className={styles.panel_content}>
          <div className={styles.canvas}>
            <Draggable>
              <div style={{ background: '#999', width: '50px', height: '50px' }}>122</div>
            </Draggable>
          </div>
        </div>
      </section>
    );
  }
}

export default PanelDraw;
