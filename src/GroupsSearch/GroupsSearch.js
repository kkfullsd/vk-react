import React from 'react'
import CountrySeclect from '../ui/CoutrySelect/CountrySelect'
import CitySelect from '../ui/CitySelect/CitySelect'
import classes from './GroupsSearch.module.scss'
import loader from '../ui/loader/loader.module.scss'
import CopyButton from '../ui/CopyButton/CopyButton'
import styles from '../style/style.module.scss'
import Select from 'react-select';

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

     sortOptions = [
        {value:0, label: 'Cортировать по умолчанию (аналогично результатам поиска в полной версии сайта)'},
        {value:1, label: 'Cортировать по скорости ростa'},
        {value:2, label: 'Cортировать по отношению дневной посещаемости к количеству пользователей'},
        {value:3, label: 'Cортировать по отношению дневной посещаемости к количеству пользователей'},
        {value:4, label: 'Cортировать по отношению количества комментариев к количеству пользователей'},
        {value:5, label: 'Cортировать по отношению количества записей в обсуждениях к количеству пользователей'}
    ]

    groupTypeOptions = [
        {value:'', label:"Не важно"},
        {value:'group', label:"Группа"},
        {value:'page', label:"Паблик"},
        {value:'event', label:"Событие"},
    ]


    

    qHandler = (value) => {

        this.setState({
            valid: true
        })
        
        let state = {...this.state}
        state.param.q = value.split(',')

        this.setState({state})
    }

    searchGroups = () => {
        console.log(this.state.param)

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
                window.VK.Api.call('groups.search', {q: this.state.param.q[counter], type: this.state.param.type, country_id: this.state.param.country_id, city_id:this.state.param.city_id, count: 1000, v:'5.73'},  (r) => {
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


    dropdownStyle = {
        container: (provided, state) => ({
            ...provided,
            width: '285px',
            borderColor: state.isFocused ? '#008000' : '#008000'
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'transparent',
            borderWidth: '0',
            borderRadius: '0',
            borderBottom: '1px solid #008000',
        
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            paddingLeft: '0px',
            
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: '#121212cc',
            
        }),
      }

    


    render() {
        document.title = 'Поиск групп по параметрам'

        let valid = this.state.valid ? null : classes.error
        return(
            <div className={classes.GroupsSearch} >

                <div className={classes.control}>
                    {/* <label htmlFor='q'>Ключевые слова через запятую</label> */}
                    <input className={valid} id='q' onChange={(event) => this.qHandler(event.target.value)} placeholder="Ключевые слова"/>
                </div>

                <div className={classes.control}>
                <label htmlFor='selecttype'>Тип сообщества
                <Select 
                    options={this.groupTypeOptions}
                    styles={this.dropdownStyle}
                    onChange={selectedOption => {
                        let state = this.state
                        state.param.type = selectedOption.value

                        this.setState(state)
                    } }
                    value={this.groupTypeOptions.filter(obj=>obj.value === this.state.param.type)[0]}

                    
                    />
                
                </label>
                {/* <select id='selecttype' onChange={this.uniSelectHandler} name='type'>
                    <option value=''>Не важно</option>
                    <option value='group' >Группа</option>
                    <option value='page'>Паблик</option>
                    <option value='event'>Событие</option>
                </select> */}
                </div>
                
                <div className={classes.control}>
                    <CountrySeclect onSelect={this.uniSelectHandler} country_id={this.state.param.country_id}
                    onSelect={selectedOption => {
                        let state = this.state
                        state.param.country_id = selectedOption.value
                        state.param.city_id = ''
                        this.setState(state)
                        console.log(this.state)
                    }}
                    />
                </div>

                {this.state.param.country_id==='' ? null : 
                    <div className={classes.control}>
                        <CitySelect 
                        country_id={this.state.param.country_id} 
                        city_id={this.state.param.city_id} 
                        onSelect={selectedOption => {
                            let state = this.state
                            state.param.city_id = selectedOption.value
    
                            this.setState(state)
                            console.log(this.state.param.city_id)
                        }}
                        
                        />
                     </div>
                }


                <div className={classes.control}>
                    <label htmlFor='sort'>Сортировка по:
                    <Select
                        styles={this.dropdownStyle}
                        options={this.sortOptions}
                        value={this.sortOptions.filter(obj=>obj.value === this.state.param.sort)[0]}
                        onChange={selectedOption => {
                            let state = this.state
                            state.param.sort = selectedOption.value

                            this.setState(state)
                        }
                        }
                    />

                    
                    </label>
                </div>
                <div className={classes.control} >
                <label htmlFor='min'>Минимум участников:</label>
                <input type='number' id='min' name='min' placeholder={this.state.filter.min} onChange={(event)=>this.minMaxHandler(event)} /> 
                </div>

                <div className={classes.control} >
                <label htmlFor='max'>Максимум участников:</label>
                <input type='number' id='max' name='max' placeholder={this.state.filter.max} onChange={(event)=>this.minMaxHandler(event)}/>
                </div>

                

                <div className={classes.checkgroup}>

                    <input type='checkbox' 
                    className={styles.checkbox}
                    onChange={()=>{
                        this.setState(prevState=>{
                            prevState.filter.canPost = !prevState.filter.canPost
                            return prevState
                        })
                        console.log(this.state.filter.canPost)
                    }
                    } />

                    <label className={styles.label} htmlFor='canPost'>Только с открытой стеной</label>
                </div>

                {this.state.loading ? null : 
                    <div>
                        <button className={styles.button} onClick={this.searchGroups}> Найти группы </button>
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