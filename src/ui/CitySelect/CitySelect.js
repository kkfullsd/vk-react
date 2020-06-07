import React, { useState } from 'react'
import Select from 'react-select'

const CitySelect = props => {

   let [cities, changeCities] = useState([])

   const dropdownStyle = {
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

   let getCities = (props) => {

            window.VK.Api.call('database.getCities', {country_id: props.country_id, need_all: 0, count: 1000, v:'5.73'}, (r)=>{
                if(r.response){
                    changeCities(r.response.items)

                } else {
                    console.log('stmth goes wrong')
                }
            })
       
        
    }

    getCities(props)

    const citiesOptions = cities.length > 0 ? cities.map(city=>({value:city.id, label:city.title})) : []

    return (
        <>
        <label htmlFor='city_id'>Укажите город 
        <Select 
          options={citiesOptions}
          styles={dropdownStyle}
          value={citiesOptions.length > 0 ? citiesOptions.filter(obj=>obj.value === props.city_id)[0] : {value: '', label: 'Не важно'}}
          defaultValue={{value: '', label: 'Не важно'}}
          onChange={props.onSelect}
        />
        
        </label>

        {/* {cities.length === 0 ? 
            <small>Сначала укажите страну</small>
        :
        
            <select id="city_id" onChange={props.onSelect} name='city_id' >

                <option value='' key={'unic2'} >
                    Не важно
                </option>

                {cities.map((country)=>{
                    return (
                        <option value={country.id} key={country.id} >
                            {country.title}
                        </option>
                    )
                })}
            </select>
        
        
        } */}



        </>

    )
}

export default CitySelect