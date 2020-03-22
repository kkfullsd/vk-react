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
    }

    

    qHandler = (value) => {

        this.setState({
            valid: true
        })

        console.log(value, this.state.param.q)
        
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

            if (this.state.output.length === 0) {
                this.setState({
                    loading: true
                })
    
                const stateStamp = this.state.output
    
                setTimeout(()=>
                    stateStamp === this.state.output ? this.searchGroups() : null
                , 2000)
        
                for (let q of this.state.param.q) {
                window.VK.Api.call('groups.search', {q: q, type: this.state.param.type, country_id: this.state.param.country_id, count: 1000, v:'5.73'},  (r) => {
                    if(r.response) {
                     
                        this.setState((prevState)=>{
                            return {
                                output: prevState.output.concat(r.response.items)
                            }
                        })
    
                        this.setState({loading: false})
        
                    } 
                }
                
                ) }


            } else {

                this.setState({
                    output:[]
                })

                setTimeout(()=>{
                    this.searchGroups()
                }, 300)
                


            }

           

        }

        
    } 




    groupsList = () => {
        if (this.state.output.length > 0) {

        return (
        <div className={classes.output}>
        <CopyButton className={classes.copyButton} output={this.state.output} >Скопировать все</CopyButton>
            {this.state.output.map((group, index)=>{
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
                return <div className={loader.loader}></div>
            }
        }

        
    }

    uniSelectHandler = event => {
        let state = {...this.state}
        state.param[event.target.name] = event.target.value

        this.setState({state})

        console.log(this.state)
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

                {this.state.loading ? null : 
                    <div>
                        <button className={classes.searchButton} onClick={this.searchGroups}> Найти группы </button>
                    </div>
                 }
                

                <div>
                   {this.state.output.length !== 0 ? <h3>Всего найдено групп: {this.state.output.length} </h3> : null } 
                </div>

                
                {this.groupsList()}



            </div>
        )
    }
    




}