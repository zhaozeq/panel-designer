import { Drawer, Tabs, Button, Switch, Icon, Input, TimePicker } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;
const CATE1 = [
  {
    title: '基础组件',
    data: [
      { name: '按钮', enName: 'Button' },
      { name: '开关', enName: 'Switch' },
      { name: '图标', enName: 'Icon' },
      { name: '输入框', enName: 'Input' },
      { name: '时间', enName: 'TimePicker' },
      { name: '按钮1', enName: 'Button' },
      { name: '开关2', enName: 'Switch' },
    ],
  },
  {
    title: '布尔组件',
    data: [],
  },
  {
    title: '范围组件',
    data: [],
  },
];

export default ({ visible, onClose, ...props }) => {
  return (
    <Drawer
      title="组件列表"
      placement="left"
      style={{ position: 'absolute' }}
      className={styles.drawer}
      width={580}
      mask={false}
      onClose={onClose}
      visible={visible}
      {...props}
    >
      <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: '100%' }}>
        {CATE1.map(o => (
          <TabPane tab={o.title} key={o.title}>
            <div className={styles.list_wrap}>
              {o.data.map(item => (
                <Component key={item.name} {...item} />
              ))}
            </div>
          </TabPane>
        ))}
      </Tabs>
    </Drawer>
  );
};

const Component = ({ name, enName }) => {
  return (
    <div className={styles.comp}>
      <div className={styles.content}>
        {enName === 'Button' && <Button>{name}</Button>}
        {enName === 'Switch' && <Switch>{name}</Switch>}
        {enName === 'Icon' && <Icon style={{ color: '#888', fontSize: '16px' }} type="question" />}
        {enName === 'Input' && <Input value={name} />}
        {enName === 'TimePicker' && <TimePicker>{name}</TimePicker>}
      </div>
      <div className={styles.name}>{name}</div>
    </div>
  );
};
