import React, { useState } from 'react'

const CitySelect = props => {

   let [cities, changeCities] = useState([])

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

    return (
        <>
        <label htmlFor='city_id'>Укажите город</label>

        {cities.length === 0 ? 
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
        
        
        }



        </>

    )
}

export default CitySelect