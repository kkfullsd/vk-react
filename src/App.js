import React from 'react';
import classes from './App.module.scss';
import GroupsSearch from './GroupsSearch/GroupsSearch';
import { Route, Switch, NavLink } from 'react-router-dom'
import GropsCanPost from './GroupsCanPost/GroupsCanPost';
import BroBotList from './BroBotList/BroBotList'
import ParsGroupMembers from './ParsGroupMembers/ParsGroupMembers';
import GroupsCross from './GroupsCross/GroupsCross'
import GroupsAdmins from './GroupsAdmins/GroupsAdmins'

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
        <NavLink className={classes.NavLink} to='/brobotlist'>
          Сформировать список для БроБота
        </NavLink>
        <NavLink className={classes.NavLink} to='/parsgroupmembers'>
          Все участники групп
        </NavLink>
        <NavLink className={classes.NavLink} to='/groupscross'>
          Состоящие в нескольких группах
        </NavLink>
        <NavLink className={classes.NavLink} to='/groupsadmins'>
          Администраторы групп
        </NavLink>

      </nav> :
      <button className={classes.LoginButton} onClick={this.authVk}>Войти VK</button>

      }
      

      {this.state.loginStatus == 'connected' ? <Switch>
        <Route path='/groupssearch' component={GroupsSearch} exact />
        <Route path='/groupscanpost' component={GropsCanPost} exact />
        <Route path='/brobotlist' component={BroBotList} exact />
        <Route path='/parsgroupmembers' component={ParsGroupMembers} exact />
        <Route path='/groupscross' component={GroupsCross} exact />
        <Route path='/groupsadmins' component={GroupsAdmins} exact />


        {/* <Route path='/' component={GroupsSearch} exact /> */}
      </Switch>
      : <div>Тут будет привлекательное описание</div>
      }
      
    
      
      </div>
    );

  }
}
