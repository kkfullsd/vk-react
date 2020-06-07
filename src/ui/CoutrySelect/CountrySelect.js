import React, { useState, useEffect } from 'react'
import Select from 'react-select';


const CountrySelect = props => {

   let [countries, changeCountries] = useState([])

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

   const countriesOptions = countries.length > 0 ? countries.map(country=>({value:country.id, label:country.title})) : []

    useEffect(()=>{
        if (countries.length === 0) {
        window.VK.Api.call('database.getCountries', {need_all: 0, v:'5.73'}, (r)=>{
            if(r.response){
                changeCountries(r.response.items)
                changeCountries(prevState=>prevState.concat({id: '', title: 'Не важно'}))
            } 
        })
    }
    })

    return (
        <>
        <label htmlFor='country_id' >Укажите страну
        <Select 
            options={countriesOptions}
            styles={dropdownStyle}
            value={countriesOptions.length > 0 ? countriesOptions.filter(obj=>obj.value === props.country_id)[0] : {value: '', label: 'Не важно'}}
            defaultValue={{value: '', label: 'Не важно'}}
            onChange={props.onSelect}
        />
        
        </label>
    


        </>

    )
}

export default CountrySelect