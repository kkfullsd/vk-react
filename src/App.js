import React from 'react';
import './App.css';
import GroupsSearch from './GroupsSearch/GroupsSearch';

export default class App extends React.Component {

  state = {
    output: null,
  }

  authVk() {
    window.VK.Auth.login(()=>{console.log('logged')})
  }

  // showCall = () => {
  //   window.VK.Api.call('groups.search',{q: 'Бурятия', v:'5.73'}, (r) => {
  //     if(r.response) {
  //       console.log(r.response)
  //       this.setState({
  //         output: r.response.items
  //       })
  //     }
  //   })
  // }

  


  render() {
    // let output = null;

    // if (this.state.output) {
    //   output = this.state.output.map((id, index)=> {
    //     return (
    //       <div>
    //         {index+1}:{id.id}
    //       </div>
    //     )
    //   })
    // }

    return (
      <div className="App">
      <h1>VK</h1>
      <button onClick={this.authVk}>Войти VK</button>
      <GroupsSearch />
      {/* <button onClick={this.showCall}>Show Call</button> */}
      {/* <h2>Всего Найдено: {this.state.output ? (this.state.output instanceof Array) ? this.state.output.length : '0' : '0'}</h2> */}
      {/* {output} */}
    
      </div>
    );

  }
}
