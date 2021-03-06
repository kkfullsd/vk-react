import React, { useState } from 'react'
import classes from './UsersFilter.module.scss'
import styles from '../style/style.module.scss'
import {dropdownStyle} from '../style/style'
import {Filter} from './Filters/Filter/Filter'
import CountrySelect from '../ui/CoutrySelect/CountrySelect'
import CitySelect from '../ui/CitySelect/CitySelect'
import VK from '../VK/VK' 
import {selectRelationOptions} from './selectOptions'
import Select from 'react-select';
import CopyButton from '../ui/CopyButton/CopyButton'
import loader from '../ui/loader/loader.module.scss'

export const UsersFilter = () => {
    document.title = 'Фильтр пользователей по параметрам'

    const [users, setUsers] = useState([])
    const [status, setStatus] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [output, setOutput] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    //ФИЛЬТРЫ
    const [filtersList, setFiltersList] = useState([])
    const [sexFilter, setSexFilter] = useState(0)
    const [minAgeFilter, setMinAgeFilter] = useState(0)
    const [maxAgeFilter, setMaxAgeFilter] = useState(99)
    const [countryFilter, setCountryFilter] = useState('')
    const [cityFilter, setCityFilter] = useState('')
    const [relationFilter, setRelationFilter] = useState([])
    const [eduFilter, setEduFilter] = useState('')
    const [minFollowersFilter, setMinFollowersFilter] = useState(0)
    const [maxFollowersFilter, setMaxFollowersFilter] = useState(0)
    const [canWriteFilter, setCanWriteFilter] = useState(1)
    const [isClosedFilter, setIsClosedFilter] = useState(false)

    

    const startFilter = async () =>{
      if (users.length > 0) {
        setStatus('')
        setFilterStatus('')
        setOutput([])
        setIsLoading(true)
          let filters = {
            sexFilter,
            minAgeFilter,
            maxAgeFilter,
            countryFilter,
            cityFilter,
            relationFilter,
            eduFilter,
            minFollowersFilter,
            maxFollowersFilter,
            canWriteFilter,
            isClosedFilter,
          }

          let result = await VK.getUsers(users, filtersList, filters, statusUpdater, filterStatusUpdater)
          setOutput(result)
          setIsLoading(false)
      } 
        
    }

    const statusUpdater = num => {
        setStatus(`${num}`)
    }

    const filterStatusUpdater = num => {
        setFilterStatus(`${num}`)
    }

    const addFilter = filterName => {
        setFiltersList(filtersList.concat(filterName))
    }

    const delFilter = filterName => {
        setFiltersList(filtersList.filter((elem)=>elem !== filterName))
    }

    const outputRender = 
      <div className={styles.output}>
      <CopyButton output={output.map(usr=>'https://vk.com/'+usr.screen_name)} />
          {output.map(usr=>{
            return (
              <div
                key={usr.id}
              >
                https://vk.com/{usr.screen_name}
              </div>
            )
          })}
      </div>
    

    return (
      <div className={classes.main}>
        <div className={styles.description}>
          Скрипт фильтрует пользователей по параметрам.
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Вставьте список адресов пользователей"
          onChange={(e) => {
            setUsers(e.target.value.split("\n"));
          }}
        />

        <Filter //ПО ПОЛУ 'sexFilter'
          title="полу"
          name="sexFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <label className={classes.radiolabel}>
            <input type="radio" name="sex" onChange={() => setSexFilter(2)} />
            Только мужчины
          </label>
          <label className={classes.radiolabel}>
            <input type="radio" name="sex" onChange={() => setSexFilter(1)} />
            Только женщины
          </label>
        </Filter>

        <Filter //ПО ВОЗРАСТУ 'ageFilter'
          title="возрасту"
          name="ageFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <label className={classes.numLabel}>
            От
            <input
              type="number"
              onChange={(e) => setMinAgeFilter(+e.target.value)}
              value={minAgeFilter}
            />
            лет
          </label>

          <label className={classes.numLabel}>
            До
            <input
              type="number"
              onChange={(e) => setMaxAgeFilter(+e.target.value)}
              value={maxAgeFilter}
            />
            лет
          </label>
        </Filter>

        <Filter //ПО МЕСТОПОЛОЖЕНИЮ 'geoFilter'
          title="местоположению"
          name="geoFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <CountrySelect
            onSelect={(selectedValue) => {
              setCountryFilter(selectedValue.value);
              setCityFilter("");
            }}
            country_id={countryFilter}
          />
          <br />
          {countryFilter ? (
            <CitySelect
              onSelect={(selectedValue) => {
                setCityFilter(selectedValue.value);
              }}
              country_id={countryFilter}
              city_id={cityFilter}
            />
          ) : null}
        </Filter>

        <Filter //ПО СЕМЕЙНОМУ ПОЛОЖЕНИЮ 'relationFilter'
          title="семейному положению"
          name="relationFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <span>Выберите один или несколько вариантов</span>
          <Select
            //defaultValue={selectRelationOptions[0]}
            styles={dropdownStyle}
            isMulti
            options={selectRelationOptions}
            value={relationFilter.map(
              (val) =>
                selectRelationOptions.filter((obj) => obj.value === val)[0]
            )}
            onChange={(selectedValue) => {
              if (selectedValue) {
                setRelationFilter(selectedValue.map((val) => val.value));
              } else {
                setRelationFilter([]);
              }
            }}
          />
        </Filter>

        <Filter //ПО ОБРАЗОВАНИЮ 'eduFilter'
          title="по слову в названии ВУЗа, факультета, специальности"
          name="eduFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <input
            className={styles.textinput}
            type="text"
            value={eduFilter}
            onChange={(e) => setEduFilter(e.target.value)}
            placeholder='Например, МГУ'
          />
        </Filter>
        
        <Filter //ПО КОЛИЧЕСТВУ ПОДПИСЧИКОВ 'ageFilter'
          title="количеству подписчиков"
          name="followersFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <label className={classes.numLabel}>
            От
            <input
              type="number"
              onChange={(e) => setMinFollowersFilter(+e.target.value)}
              value={minFollowersFilter}
            />
          </label>

          <label className={classes.numLabel}>
            До
            <input
              type="number"
              onChange={(e) => setMaxFollowersFilter(+e.target.value)}
              value={maxFollowersFilter}
            />
          </label>
        </Filter>
       
        <Filter //ПО ОТКРЫТЫМ ЛИЧНЫМ СООБЩЕНИЯМ 'sexFilter'
          title="открытым сообщениям"
          name="canWriteFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <label className={classes.radiolabel}>
            <input type="radio" name="canWrite" onChange={() => setCanWriteFilter(0)} />
            Нельзя отправлять личные сообщения
          </label>
          <label className={classes.radiolabel}>
            <input type="radio" name="canWrite" onChange={() => setCanWriteFilter(1)} />
            Можно отправлять личные сообщения
          </label>
        </Filter>
        
        <Filter //ОТКРЫТОМУ ПРОФИЛЮ 'sexFilter'
          title="открытому профилю"
          name="isClosedFilter"
          addFilter={addFilter}
          delFilter={delFilter}
        >
          <label className={classes.radiolabel}>
            <input type="radio" name="isClosedFilter" onChange={() => setIsClosedFilter(false)} />
            Только открытые профили
          </label>
          <label className={classes.radiolabel}>
            <input type="radio" name="isClosedFilter" onChange={() => setIsClosedFilter(true)} />
            Только закрытые профили
          </label>
        </Filter>
       
        <button className={styles.button} onClick={startFilter}>
          Фильтровать пользователей
        </button>
        
        {status ? <span>Пользователей собрано: {status}</span> : null }
        {filterStatus ? <span>Пользователей отфильтровано: {filterStatus}</span> : null}

        {isLoading ? <div className={loader.loader} />  : null}
        
        {output.length > 0 ? outputRender : null}
        </div>
    );
}