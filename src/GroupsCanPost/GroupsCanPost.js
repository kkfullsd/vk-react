import React, { useState } from 'react'
import classes from './GroupsCanPost.module.scss'

const GropsCanPost = () => {

   const [state, changeState] = useState([])
   const [filtered, changeFiltered] = useState([])

   let filterGroups = () => {
    
        for (let i = 0; i < Math.floor(state.length / 500); i++) {
            let istart = i*500;
            let ifinish = istart+500;
            let groups = state.slice(istart, ifinish).join(',')

            window.VK.Api.call('groups.getById', {group_ids: groups, fields: 'can_post', v:'5.73' }, (r)=>{
                if (r.response) {
                    r.response.map((group, index)=>{
                        if (group.can_post === 1) {
                            changeFiltered((prevState)=>prevState.concat(group))
                        }
                    })
                }
            })
        }

   }


    return(
        <div className={classes.container}>
            <label for='initialGroups'>Вставьте группы, которые нужно отсортировать по открытой стене</label>
            <textarea 
                id='initialGroups'
                name='initialGroups' 
                onChange={event=>{
                    changeState(event.target.value.split('\nhttps://vk.com/'))
                }}
                /> 
            <button className={classes.sortButton} onClick={filterGroups} >Отсортировать</button> 
            <h3 className={classes.counter} >Всего групп с открытой стеной получено: {filtered.length}</h3>
            <div className={classes.result}> 
            
                {filtered.map((group, index)=>{
                    return (
                        <div key={index} >
                        {'https://vk.com/'+group.screen_name}
                        </div>
                    )
                
            })}
            
            </div>


        </div>
    )
}


export default GropsCanPost

