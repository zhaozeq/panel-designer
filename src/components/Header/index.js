import React from 'react';
import { connect } from 'zus';
import { Button, Icon, Avatar } from 'antd';

import styles from './index.less';

@connect(({ home, loading }) => ({ home, loading }))
class Header extends React.Component {
  action = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/updateState',
      payload: { openAction: type },
    });
  };

  render() {
    return (
      <header className={styles.header}>
        <h1 className={styles.logo}>Panel-Designer</h1>
        <div className={styles.interaction}>
          <div className={styles.button} onClick={() => this.action('component')}>
            <Icon type="appstore" />
            <span>组件</span>
          </div>
          <div className={styles.button}>
            <Icon type="font-size" />
            <span>文字</span>
          </div>
          <div className={styles.button}>
            <Icon type="file-image" />
            <span>图片</span>
          </div>
          <div className={styles.button}>
            <Icon type="customer-service" />
            <span>音频</span>
          </div>
          <div className={styles.button}>
            <Icon type="video-camera" />
            <span>视频</span>
          </div>
          <div className={styles.button}>
            <Icon type="robot" />
            <span>背景</span>
          </div>
        </div>
        <div className={styles.operate}>
          <div className={styles.borderLight}>
            <Icon type="database" />
            <span>素材中心</span>
          </div>
          <div className={styles.borderLight}>
            <Icon type="eye" />
            <span> 预览</span>
            <Button className={styles.marginLeft} size="small">
              <Icon type="save" />
              保存
            </Button>
            <Button type="primary" className={styles.marginLeft} size="small">
              <Icon type="cloud" />
              发布
            </Button>
          </div>
          <div className={styles.borderLight}>
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
