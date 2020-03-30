import React, { useState } from 'react'
import classes from './GroupsCanPost.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'

const GropsCanPost = () => {

   const [state, changeState] = useState([])
   const [filtered, changeFiltered] = useState([])
   const [isValid, changeValid] = useState(true)
   const [isLoading, changeIsLoading] = useState(false)
   const [isFail, changeIsFail] = useState(false)


   let filterGroups = (r) => {

        

        if (state.length > 0) {
            
            let fail = setTimeout(()=>{
                if (filtered.length === 0) {
                    changeIsLoading(false)
                    changeValid(false)
                    changeIsFail(true)
                }
            }, 5000)

            if (filtered.length === 0 || r === 'repeat') {

                

                changeIsLoading(true)
                changeValid(true)
                for (let i = 0; i < Math.floor(state.length / 500); i++) {
                    let istart = i*500;
                    let ifinish = istart+500;
                    let groups = state.slice(istart, ifinish).join(',')


                    window.VK.Api.call('groups.getById', {group_ids: groups, fields: 'can_post', v:'5.73' }, (r)=>{
                        if (r.response) {
                            clearTimeout(fail)
                            if (i = Math.floor(state.length / 500)) { // TEST TEST TEST
                                changeIsLoading(false)
                            }                 
                            r.response.map((group)=>{
                                if (group.can_post === 1) {
                                    changeFiltered((prevState)=>prevState.concat(group))
                                    changeIsFail(false)
                                }
                            })
                        } else {
                            console.log('r response ne prishel')
                            setTimeout(()=>{filterGroups()}, 1000) //TEST TEST TEST
                            
                        }
                    })
                }

            } else {
                changeFiltered([])
                setTimeout(()=>{filterGroups('repeat')}, 0)
                
            }

            

        } else {
            changeValid(false)
        }

   }


    return(
        <div className={classes.container}>
            <label htmlFor='initialGroups'>Вставьте группы, которые нужно отсортировать по открытой стене</label>
            <textarea 
                className={isValid? ' ': classes.error}
                id='initialGroups'
                name='initialGroups' 
                onChange={event=>{
                    changeState(event.target.value.split('\nhttps://vk.com/'))
                }}
                />

                {isLoading ? 
                    <div className={loader.loader}></div> :
                    <button className={classes.sortButton} onClick={filterGroups} >Отсортировать</button>
                }
            
            
            {filtered.length === 0  ? null :
            <>
            <h3 className={classes.counter} >Всего групп с открытой стеной получено: {filtered.length}</h3>
            <div className={classes.result}> 
                <CopyButton className={classes.copyButton} output={filtered} >Скопировать все</CopyButton>
                {filtered.map((group, index)=>{
                    return (
                        <div key={index} >
                        {'https://vk.com/'+group.screen_name}
                        </div>
                    )
                
            })}

            
            
            </div> 
            </>
            }

            { state.length > 0 && filtered.length === 0 && isLoading === false && isFail ? <p>Ничего не найдено</p> : null}
            


        </div>
    )
}


export default GropsCanPost

