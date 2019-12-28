import React from 'react'

export default class GroupsSearch extends React.Component {

    state = {
        param: {
            q: [],
            type: "group",
            country_id: 1,
            city_id: 1,
            sort: 0,
            count: 1000,
            v: "5.73",
        },
        output: [],
    }

    qHandler = (value) => {
        const q = value.split(',')
        this.setState({param:{q:q}})
    }

    searchGroups = () => {
        for (let q of this.state.param.q) {
        window.VK.Api.call('groups.search', {q: q, count: 1000, v:'5.73'},  (r) => {
            if(r.response) {
                console.log(r.response)

                this.setState({
                    output: this.state.output.concat(r.response.items)
                })

                console.log('state: ', this.state.output)


            } 
        } )
    }



    }

    groupsList = () => {

        return (
        this.state.output.map((group)=>{
            return (
                "\n https://vk.com/" + group.screen_name
            )
        }))


        
        
       
        
    }

    
       
        
    


    render() {
        console.log('rend')
        return(
            <div>
                <input onChange={(event) => this.qHandler(event.target.value)} placeholder="Ключевое слово"/>
                <button onClick={this.searchGroups}> Найти группы </button>

                <div>
                   {this.state.output.length !== 0 ? <h3>Всего найдено групп: {this.state.output.length} </h3> : null } 
                </div>

                <div>
                    <textarea
                        readOnly
                        value={this.groupsList()}
                        rows='30'
                        cols='50'
                     />
                </div>

                


            </div>
        )
    }
    




}