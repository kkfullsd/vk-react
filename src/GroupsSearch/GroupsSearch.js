import React from 'react'
import CountrySeclect from '../ui/CoutrySelect/CountrySelect'
import CitySelect from '../ui/CitySelect/CitySelect'
import classes from './GroupsSearch.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'

export default class GroupsSearch extends React.Component {

    state = {
        param: {
            q: [],
            type: '',
            country_id: '',
            city_id: '',
            sort: 0,
            count: 1000,
            v: "5.73",
        },
        output: [],
        loading: false,
        valid: true,
        counter: 0,
        counter2: 0,
        finalOutput: [],
        filter: {
            canPost: false,
            min: 0,
            max: 999999999,
        }
    }


    

    qHandler = (value) => {

        this.setState({
            valid: true
        })
        
        let state = {...this.state}
        state.param.q = value.split(',')

        this.setState({state})
    }

    searchGroups = () => {

        if (this.state.param.q.length === 0 || this.state.param.q[0].length === 0) {
            this.setState({
                valid: false
            })
        } else {

            if (this.state.finalOutput.length === 0 && this.state.output.length === 0) {
                this.setState({
                    loading: true
                })
    
                const stateStamp = this.state.output
    
                setTimeout(()=>
                    stateStamp === this.state.output ? this.searchGroups() : null 
                , 4000)
        ///////// ЗОНА ЭКСПЕРИМЕНТОВ

        let p = () =>{

            let iterate = (counter) => {
                window.VK.Api.call('groups.search', {q: this.state.param.q[counter], type: this.state.param.type, country_id: this.state.param.country_id, count: 1000, v:'5.73'},  (r) => {
                    if(r.response) {
                        r.response.items.forEach(group=>{
                            this.setState({
                                output: this.state.output.concat(group.screen_name)
                            })
                        })
                        if (counter === this.state.param.q.length - 1) {
                            filterGroups()
                            this.setState({counter: 0})
                        } 
                        if (counter < this.state.param.q.length - 1) {
                            this.setState({
                                counter: this.state.counter + 1, 
                            })
                            setTimeout(()=>{
                                iterate(this.state.counter)
                            }, 1500)
                        }

                    } else {
                        this.setState({
                            counter: this.state.counter + 1, 
                        })
                       setTimeout(()=>{
                            iterate(this.state.counter)
                        }, 2500)
                    }
                })
            }

            iterate(this.state.counter)

            
            
        }

        let filterGroups = () =>{
        
             let filter = (counter) => { 
                console.log('итерация фильтра: ', counter)
                let istart = counter*500
                let ifinish = istart+500

                let groups = this.state.output.slice(istart, ifinish).join(',')
                if(counter < Math.floor(this.state.output.length / 500)) {
                window.VK.Api.call('groups.getById', {group_ids: groups, fields: 'can_post,members_count', v:'5.73' }, (r)=>{
                    if (r.response) {                                      
                        r.response.forEach((group)=>{
                            if (group.can_post == this.state.filter.canPost
                                 && group.members_count > this.state.filter.min
                                 && group.members_count < this.state.filter.max
                                 ) {
                                this.setState(prevState=>{
                                    prevState.finalOutput.push(group)
                                    return prevState
                                })
                            }
                        })
                    } 
                    this.setState({counter2: this.state.counter2 + 1})
                    setTimeout(()=>{
                        filter(this.state.counter2)
                    }, 1500)
                }) } else {
                    console.log('finally!!!!', this.state.finalOutput)
                    if (this.state.finalOutput.length === 0) {window.alert('По такому запросу групп не найдено')}
                    this.setState({
                        loading:false,
                        counter: 0,
                        counter2: 0,
                        output: []
                    })
                }
            }

                    if (this.state.filter.canPost) {
                        filter(this.state.counter2)
                    } else {
                        this.state.output.forEach((screen_name)=>{
                            let obj = {}
                            obj.screen_name = screen_name

                            this.setState((prevState)=>{
                                prevState.finalOutput.push(obj)
                                return prevState
                            })
                        })
                        this.setState({
                            loading:false,
                            counter: 0,
                            counter2: 0,
                            output: []
                        })
                        
                        console.log(this.state.finalOutput)
                    }



            
        }

        p()

        ////////// ЗОНА ЭКСПЕРИМЕНТОВ 
            } else {

                this.setState({
                    output:[],
                    finalOutput: [],
                })

                setTimeout(()=>{
                    this.searchGroups()
                }, 300)
                


            }

           

        }

        
    } 




    groupsList = () => {
        if (this.state.finalOutput.length > 0 && this.state.loading === false) {

        return (
        <div className={classes.output}>
        <CopyButton className={classes.copyButton} output={this.state.finalOutput} >Скопировать все</CopyButton>
            {this.state.finalOutput.map((group, index)=>{
                return (
                    <div key={index}>
                    {"https://vk.com/" + group.screen_name}
                    </div>
                )
            })}
        </div>
        ) 
        } else {
            if (this.state.loading) {
                return (
                    <div>
                <div className={loader.loader}></div>

                <div><h4>{this.state.counter !==0 ? ((this.state.counter  / this.state.param.q.length)*100).toFixed(2) + '% - поиск групп' : null}</h4></div>

                <div><h4>{this.state.counter2 !==0 ? ((this.state.counter2  / Math.floor(this.state.output.length / 500))*100).toFixed(2) + '% - фильтр по параметрам' : null}</h4></div>
                </div>
                )
            }
        }

        
    }

    uniSelectHandler = event => {
        let state = {...this.state}
        state.param[event.target.name] = event.target.value
        this.setState({state})
        }

    minMaxHandler = event => {
        let state = {...this.state}
        state.filter[event.target.name] = +event.target.value
        this.setState({state})
    }

    


    render() {
        let valid = this.state.valid ? null : classes.error
        return(
            <div className={classes.GroupsSearch} >

                <div className={classes.control}>
                    <label htmlFor='q'>Ключевое слово или ключевые слова через запятую</label>
                    <input className={valid} id='q' onChange={(event) => this.qHandler(event.target.value)} placeholder="Ключевое слово"/>
                </div>

                <div className={classes.control}>
                <label htmlFor='selecttype'>Тип сообщества</label>
                <select id='selecttype' onChange={this.uniSelectHandler} name='type'>
                    <option value=''>Не важно</option>
                    <option value='group' >Группа</option>
                    <option value='page'>Паблик</option>
                    <option value='event'>Событие</option>
                </select>
                </div>
                
                <div className={classes.control}>
                    <CountrySeclect onSelect={this.uniSelectHandler} />
                </div>

                {this.state.param.country_id==='' ? null : 
                    <div className={classes.control}>
                        <CitySelect country_id={this.state.param.country_id} onSelect={this.uniSelectHandler} />
                     </div>
                }


                <div className={classes.control}>
                    <label htmlFor='sort'>Сортировка по:</label>
                    <select name='sort' id='sort' onChange={this.uniSelectHandler} >
                        <option value='0'>сортировать по умолчанию (аналогично результатам поиска в полной версии сайта)</option>
                        <option value='1'>сортировать по скорости роста</option>
                        <option value='2'>сортировать по отношению дневной посещаемости к количеству пользователей</option>
                        <option value='3'>сортировать по отношению дневной посещаемости к количеству пользователей; </option>
                        <option value='4'>сортировать по отношению количества комментариев к количеству пользователей</option>
                        <option value='5'>сортировать по отношению количества записей в обсуждениях к количеству пользователей</option>
                    </select>
                </div>
                <div className={classes.control} >
                <label htmlFor='min'>Минимум участников:</label>
                <input type='number' id='min' name='min' placeholder={this.state.filter.min} onChange={(event)=>this.minMaxHandler(event)} /> 

                <label htmlFor='max'>Максимум участников:</label>
                <input type='number' id='max' name='max' placeholder={this.state.filter.max} onChange={(event)=>this.minMaxHandler(event)}/>
                    

                </div>

                <div className={classes.checkgroup}>

                    <input type='checkbox' onChange={()=>{
                        this.setState(prevState=>{
                            prevState.filter.canPost = !prevState.filter.canPost
                            return prevState
                        })
                        console.log(this.state.filter.canPost)
                    }
                    } />

                    <label htmlFor='canPost'>Только с открытой стеной</label>
                </div>

                {this.state.loading ? null : 
                    <div>
                        <button className={classes.searchButton} onClick={this.searchGroups}> Найти группы </button>
                    </div>
                 }
                

                <div>
                   {this.state.finalOutput.length !== 0 && this.state.loading === false ? <h3>Всего найдено групп: {this.state.finalOutput.length} </h3> : null } 
                </div>

                
                {this.groupsList()}



            </div>
        )
    }
    




}