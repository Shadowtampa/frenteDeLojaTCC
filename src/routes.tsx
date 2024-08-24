import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Crud from './pages/Crud';

const Routes = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/cart" component={Cart} />
      <Route path="/admin" component={Crud} />
    </Switch>
  );
};

export default Routes;
