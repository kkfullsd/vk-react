let VK = {}

VK.call = function (method, params) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            window.VK.Api.call(method, params, (r)=>{
                if (r.response) {
                    resolve(r.response)
                } else {
                    reject(r.error)
                }
            })
        }, 300)
        
    })
}

VK.groupsGetMembers = async (gid, offset = 0) => {
    if (gid.trim() == ' ' || gid.trim() === '' || gid == '\n') return []
    let response = await VK.call('groups.getMembers', {group_id: cleanURL(gid), offset:offset, v:'5.73'})
    return(response.items)
}


VK.groupsGetMembersCount = async (gid, offset = 0) => {
    if (gid.trim() == ' ' || gid.trim() === '' || gid == '\n') return 0
    let response = await VK.call('groups.getMembers', {group_id: cleanURL(gid), offset:offset, v:'5.73'})
    return(response.count)
}

VK.groupGetAllMembers = async (gid, callback) => {
    let output = []

    let groupMembers = Math.ceil(await VK.groupsGetMembersCount(gid) / 1000)

    let iterate =  async (num) =>{ 
            if (num < groupMembers) {
                let result = await VK.groupsGetMembers(gid, num*1000)
                result.forEach((group)=>{
                    output.push(group)
                })
                console.log(output)
                iterate(num+1)
            } else {
                return callback(output)
            }     
   }

   await iterate(0)

}


VK.cross = (arr, num) =>{
    let result = {}

    arr.forEach(elem => {
        if (result[elem] !== undefined) {
            result[elem] = result[elem] + 1
        } else {
            result[elem] = 1
        } 
    });

    for (let key in result) {
        if (result[key] < num) {
            delete result[key]
        }
    }  
    
    return result
}

VK.groupGetById = async (group) => {
    console.log(group)
   if (group.trim() == ' ' || group.trim() === '' || group == '\n') return 0
   let q = cleanURL(group)
   let result = await VK.call('groups.getById', {group_id: q, fields:'contacts', v:'5.73'})
   return result
}


VK.getAllGroupById = async (arr, callback) => {
    let result = []


    let iterate = async (num) => {
        if (num === arr.length) {
           callback(result)
        } else {
            let add = await VK.groupGetById(arr[num])
            if(add[0] !== undefined && add[0].contacts) {
                add[0].contacts.forEach(contact=>result.push(contact))
            }
            iterate(num+1)
            console.log(num)
        }

    }

    iterate(0)
        
}

VK.groupsAdmins = async (arr, callback) => {
    await VK.getAllGroupById(arr, (result)=>{
        callback(result)
    })


}

VK.getGroupPosts = async (groups, params) => {
    let container = []

    for (let group of groups) {
        let domain = cleanURL(group)
        let posts = await VK.call('wall.get', {domain, count: params.count, filter: params.filter, extended: 1, fields: 'screen_name',  v:'5.73'})
        for (let item of posts.items) {
            let url = `https://vk.com/${posts.groups[0].screen_name}?w=wall${item.from_id}_${item.id}`
            container = container.concat(url)
        }
    }

    return container
}

VK.getUsers = async (users, filtersList, filters, statusUpdater) => {
    let searchPool = []
    let finalPool = []

    users = users.map(user=>(cleanURL(user)))

    if (users.length > 500) {
      for (let i = 0; i < Math.floor(users.length / 500); i++) {
        let istart = i*500;
        let ifinish = istart+500;
        let usersString = users.slice(istart, ifinish).join(',')
        searchPool = searchPool.concat(usersString)
        }  
    } else {
        let usersString = users.join(',')
        searchPool.push(usersString)
    }

    for (let usersList of searchPool) {
        const result = await VK.call('users.get', {user_ids: usersList, fields: 'sex, bdate, country, city, relation', name_case: 'nom', v: '5.73'})
        finalPool = finalPool.concat(result)
        statusUpdater(finalPool.length)
    } 

    console.log(finalPool)

//Фильтрация
        if (filtersList.includes('sexFilter')) {
            finalPool = finalPool.filter(user=>user.sex === filters.sexFilter)
        }

        if (filtersList.includes('ageFilter')) {
            const date = new Date()
            const currenYear = date.getFullYear()

            finalPool = finalPool.filter(user=>{
               const UserBDate = user.bdate ? user.bdate.split('.') : null
               if (UserBDate && UserBDate[2]) {
                   let userAge = currenYear - UserBDate[2]
                   if (userAge > filters.minAgeFilter && userAge < filters.maxAgeFilter) {
                       return true
                   } else {
                       return false
                   }
               } else {
                   return false
               }
            })

        }

        if (filtersList.includes('geoFilter')) {
            finalPool = finalPool.filter(user=>{
                if (filters.cityFilter) {
                    return user.city ? user.city.id == filters.cityFilter : false
                }
                if (filters.countryFilter) {
                    return user.country ? user.country.id == filters.countryFilter : false
                }
                

            })
        }

        if (filtersList.includes('relationFilter')) {
            finalPool = finalPool.filter(user=>filters.relationFilter.includes(user.relation))
        }





        console.log('final: ', finalPool)

    
}





let cleanURL = (data) => {
    if (data.startsWith('https://vk.com/club')) {
        return data.slice(19)
    } else if (data.startsWith('https://vk.com/public')) {
        return  data.slice(21)
    } else if (data.startsWith('https://vk.com/')){
        return data.slice(15)
    } else if (data.startsWith('club')){
        return data.slice(4)
    } else {
        return data
    }
}




export default VK