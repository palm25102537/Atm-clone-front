import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { useMyContext } from './context/myContext'
import HomePage from './pages/HomePage'
import TransactionPage from './pages/TransactionPage'
function App() {
  const { state } = useMyContext()

  const privateRoutes = [
    {
      path: '/transaction',
      component: TransactionPage
    }
  ]

  const publicRoutes = [
    {
      path: '/',
      component: HomePage
    }
  ]
  return (
    <BrowserRouter>
      <Switch>
        {
          !state.isAuthen && publicRoutes.map((el, index) => (
            <Route key={index} exact path={el.path} component={el.component} />
          ))
        }
        {
          state.isAuthen && privateRoutes.map((el, index) => (
            <Route key={index} exact path={el.path} component={el.component} />
          ))
        }
        <Redirect to='/' />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
