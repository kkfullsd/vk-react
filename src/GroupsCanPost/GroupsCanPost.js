import React, { useState } from 'react'

const GropsCanPost = () => {

   let [state, changeState] = useState([])

   let [filtered, changeFiltered] = useState([])

   let filterGroups = () => {
    
        for (let i = 0; i < Math.floor(state.length / 500); i++) {
            let istart = i*500;
            let ifinish = istart+500;
            let groups = state.slice(istart, ifinish).join(',')
            console.log(groups)

            window.VK.Api.call('groups.getById', {group_ids: groups, fields: 'can_post', v:'5.73' }, (r)=>{
                if (r.response) {
                    console.log(r.response)
                    //changeFiltered(filtered.concat(r.response))
                    changeFiltered((prevState)=>prevState.concat(r.response))
                }
            })
        }

   }


    return(
        <div>
            <h2>Вставьте группы, которые нужно отсортировать по открытой стене</h2>
            <textarea 
                name='initialGroups' 
                onChange={event=>{
                    //changeState(event.target.value)
                    changeState(event.target.value.split('\nhttps://vk.com/'))
                    console.log(state)
                }}
                /> 
            <button onClick={filterGroups} >Отсоритировать</button> 
            <h3>Всего групп с открытой стеной получено: {filtered.length}</h3>
            <div style={{width: '450px', height:'500px', border:'1px solid gray', textAlign:'left'}}> 
                {filtered.map((group, index)=>{
                if (group.can_post === 1) {
                    return (
                        <div key={index} >
                        {'https://vk.com/'+group.screen_name}
                        </div>
                    )
                }
            })}</div>


        </div>
    )
}


export default GropsCanPost

