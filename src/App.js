import React from 'react';
import classes from './App.module.scss';
import GroupsSearch from './GroupsSearch/GroupsSearch';
import { Route, Switch, NavLink } from 'react-router-dom'
import GropsCanPost from './GroupsCanPost/GroupsCanPost';

export default class App extends React.Component {

  state = {
    loginStatus: 'unknow', 
  }

  authVk() {
    window.VK.Auth.login(()=>{console.log('logged')})
  }

  componentDidMount() {
    window.VK.Auth.getLoginStatus((data)=>{
      console.log(data)
      this.setState({loginStatus:data.status})
    })}



  render() {


    return (
      <div className={classes.App}>
      <h1>VK SMM TOOLS</h1>
       
      
      {this.state.loginStatus === 'connected' ? 
      <nav>
        <NavLink className={classes.NavLink} to='/groupssearch'>
          Поиск групп по параметрам
        </NavLink>
        <NavLink className={classes.NavLink} to='/groupscanpost'>
          Сортировка групп по открытой стене
        </NavLink>
        <NavLink className={classes.NavLink} to='/groupscanpost'>
          Парсинг участников группы
        </NavLink>
        <NavLink className={classes.NavLink} to='/groupscanpost'>
          Пересечения участников групп
        </NavLink>

      </nav> :
      <button className={classes.LoginButton} onClick={this.authVk}>Войти VK</button>

      }
      


      <Switch>
        <Route path='/groupssearch' component={GroupsSearch} exact />
        <Route path='/groupscanpost' component={GropsCanPost} exact />
        {/* <Route path='/' component={GroupsSearch} exact /> */}
      </Switch>
    
      
      </div>
    );

  }
}
