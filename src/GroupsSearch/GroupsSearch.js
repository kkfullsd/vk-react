import React from 'react'

export default class GroupsSearch extends React.Component {

    state = {
        param: {
            q: " ",
            type: "group",
            country_id: 1,
            city_id: 1,
            sort: 0,
            count: 1000,
            v: "5.73",
        },
        output: null,
    }

    qHandler = (value) => {
        this.setState({param:{q:value}})
    }

    searchGroups = () => {
        window.VK.Api.call('groups.search', {q: this.state.param.q, count: 1000, v:'5.73'},  (r) => {
            if(r.response) {
                console.log(r.response)
                this.setState({output: r.response})
            } 
        } )
    }


    render() {
        console.log('rend')
        return(
            <div>
                <input onChange={(event) => this.qHandler(event.target.value)} placeholder="Ключевое слово"/>
                <button onClick={this.searchGroups}> Найти группы </button>

                <div style={{width:'400px', height: "500px", overflowY:'scroll', border:'1px solid gray', margin:'10px auto', textAlign:'left'}}> 
                    {this.state.output ? this.state.output.items.map((id, index) => {
                    return (
                        <div key={index}>
                      https://vk.com/public{id.id}
                        </div>
                    )
                }) : ""}
                
                </div>
            </div>
        )
    }
    




}