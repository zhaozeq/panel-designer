// import zus from './utils/dva/src/index'
import zus from 'zus';
import '@utils/rem';
import './themes/index.less';
import createLoading from './utils/dva-loading/src';

// 1. Initialize
const app = zus({
  onError(error) {
    console.log(error);
    // 处理全局error
  },
});

// 2. Plugins
app.use({ ...createLoading({ effects: true }) });

// 3. Router
app.router(require('./router').default);

// 4. Start
app.start('#root');
