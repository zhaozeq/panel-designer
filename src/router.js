import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { dynamic } from 'zus';
import App from '@routes/App';

const routerConfig = [
  {
    path: '/',
    models: () => [import('@models/home')],
    component: () => import('@routes/Home'),
  },
];

export default ({ app }) => {
  return (
    <Router>
      <App>
        <Switch>
          {routerConfig.map(({ path, ...dynamics }) => (
            <Route
              key={path}
              exact
              path={path}
              component={dynamic({
                app,
                ...dynamics,
              })}
            />
          ))}
          <Route
            component={dynamic({
              app,
              component: () => Error,
            })}
          />
        </Switch>
      </App>
    </Router>
  );
};

const Error = () => (
  <div className="content-inner">
    <div>
      <h1>404 Not Found</h1>
    </div>
  </div>
);
