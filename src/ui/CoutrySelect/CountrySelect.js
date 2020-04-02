import React, { useState, useEffect } from 'react'

const CountrySelect = props => {

   let [countries, changeCountries] = useState([])

   

    useEffect(()=>{
        if (countries.length === 0) {
        window.VK.Api.call('database.getCountries', {need_all: 0, v:'5.73'}, (r)=>{
            if(r.response){
                changeCountries(r.response.items)
            } 
        })
    }
    })

    return (
        <>
        <label htmlFor='country_id' >Укажите страну</label>
        {countries.length === 0 ? null :
        
            <select id='country_id' onChange={props.onSelect} name='country_id' >
                <option value='' key={'unic'} >
                            Не важно
                </option>
                {countries.map((country)=>{
                    return (
                        <option value={country.id} key={country.id} >
                            {country.title}
                        </option>
                    )
                })}
            </select>
        
        
        }



        </>

    )
}

export default CountrySelect