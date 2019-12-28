import React from 'react';
import './App.css';
import GroupsSearch from './GroupsSearch/GroupsSearch';
import { Route, Switch, NavLink } from 'react-router-dom'

export default class App extends React.Component {

  state = {
    loginStatus: 'unknow', 
  }

  authVk() {
    window.VK.Auth.login(()=>{console.log('logged')})
  }

  componentDidMount() {
    window.VK.Auth.getLoginStatus((data)=>{
      this.setState({loginStatus:data.status})
    })}



  render() {


    return (
      <div className="App">
      <h1>VK</h1>
       
      
      {this.state.loginStatus === 'connected' ? 
      <nav>
        <NavLink to='/groupssearch'>
          Поиск групп по параметрам
        </NavLink>
      </nav> :
      <button onClick={this.authVk}>Войти VK</button>

      }
      


      <Switch>
        <Route path='/groupssearch' component={GroupsSearch} exact />
        {/* <Route path='/' component={GroupsSearch} exact /> */}
      </Switch>
    
      
      </div>
    );

  }
}
