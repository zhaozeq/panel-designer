import React from 'react';
import { connect } from 'zus';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from '@components/Header';
import styles from './App.less';

/* 公共节点 可以在这里处理登录、主题等 */
@connect(({ loading }) => ({ loading }))
class App extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <ConfigProvider locale={zhCN}>
        <div className={styles.layout}>
          <Header />
          {children}
        </div>
      </ConfigProvider>
    );
  }
}

export default App;
