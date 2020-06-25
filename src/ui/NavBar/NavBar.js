import React, { useState, useEffect } from 'react'
import classes from './NavBar.module.scss'
import { FaUsers, FaUser, FaChevronDown, FaHeart, FaChevronUp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'
import useOnclickOutside from "react-cool-onclickoutside";

const NavBar = () => {

    const [showGroups, setShowGroups] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
    const [showOthers, setShowOthers] = useState(false)


    const ref = useOnclickOutside(() => {
        setShowGroups(false);
        setShowUsers(false)
        setShowOthers(false)
      });

    

    const groupsOptions = (
        <div 
            className={classes.options}
            ref={ref}
            onClick={()=>setShowGroups(false)}
        >
            <NavLink className={classes.NavLink} to='/groupssearch'>
                Поиск групп по параметрам
            </NavLink>
            <NavLink className={classes.NavLink} to='/groupscanpost'>
                Сортировка групп по открытой стене
            </NavLink>
            <NavLink className={classes.NavLink} to='/parsgroupmembers'>
                Все участники групп
            </NavLink>
            <NavLink className={classes.NavLink} to='/groupscross'>
                Состоящие в нескольких группах
            </NavLink>
            <NavLink className={classes.NavLink} to='/groupsadmins'>
                Администраторы групп
            </NavLink>
            <NavLink className={classes.NavLink} to='/postsparse'>
                Парс постов со стены сообщества
            </NavLink>

        </div>
    )

    const usersOptions = (
        <div 
            className={classes.options}
            ref={ref}
            onClick={()=>setShowUsers(false)}
        >
            <NavLink className={classes.NavLink} to='/usersfilter'>
                Фильтр пользователей по параметрам
            </NavLink>

        </div>

    )

    const othersOptions = (
        <div 
        className={classes.options}
        ref={ref}
        onClick={()=>setShowOthers(false)}
    >
         <NavLink className={classes.NavLink} to='/parspostactivity'>
          Собрать всю активность с поста
        </NavLink>

    </div>
    )


    return (
        <div className={classes.NavBar} >
            <div className={classes.buttonWraper} >
                 <div className={classes.button}
                    ref={ref}
                    onClick={()=>{
                        setShowGroups(!showGroups)
                        setShowUsers(false)
                        setShowOthers(false)
                    }}
                    >
                    <FaUsers className={classes.icon} />
                    <span >Сообщества</span>
                    {showGroups ? 
                    <FaChevronUp className={classes.icon}/>
                    :
                    <FaChevronDown className={classes.icon}/>

                    }
                </div>

                {showGroups ? groupsOptions : null}
            </div>
           
            <div className={classes.buttonWraper} >
                <div 
                    className={classes.button}
                    ref={ref}
                    onClick={()=>{
                        setShowUsers(!showUsers)
                        setShowGroups(false)
                        setShowOthers(false)
                    }}
                    >
                    <FaUser className={classes.icon} />
                    <span >Пользователи</span>
                    {showUsers ? 
                    <FaChevronUp className={classes.icon}/>
                    :
                    <FaChevronDown className={classes.icon}/>
                    }                </div>
                {showUsers ? usersOptions : null}
            </div>

            <div className={classes.buttonWraper} >
                <div 
                    ref={ref}
                    className={classes.button}
                    onClick={()=>{
                        setShowOthers(!showOthers)
                        setShowUsers(false)
                        setShowGroups(false)
                    }}
                    >
                    <FaHeart className={classes.icon} />
                    <span >Сбор активности</span>
                    {showOthers ? 
                    <FaChevronUp className={classes.icon}/>
                    :
                    <FaChevronDown className={classes.icon}/>
                    }
                </div>
                {showOthers ? othersOptions : null}

            </div>

        </div>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => NavBar.handleClickOutside
};

export default NavBar

