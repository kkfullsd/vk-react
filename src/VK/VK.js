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
        let domain
        let owner_id
        let qparam

        let url = cleanPostParseUrl(group)

        if(typeof(url) === 'number') {
            owner_id = url
        } else {
            domain = url
        }

        if (domain && !owner_id) {
            qparam = {domain, count: params.count, filter: params.filter, extended: 1, fields: 'screen_name',  v:'5.73'}
        } else if (owner_id && !domain) {
            qparam = {owner_id, count: params.count, filter: params.filter, extended: 1, fields: 'screen_name',  v:'5.73'}
        } else if (domain && owner_id) {
            qparam = {domain, owner_id, count: params.count, filter: params.filter, extended: 1, fields: 'screen_name',  v:'5.73'}
        }

        try {
            let posts = await VK.call('wall.get', qparam)
            for (let item of posts.items) {
            let url = `${group}?w=wall${item.from_id}_${item.id}`
            container = container.concat(url)
            } 
        } catch (error) {
            console.log('err', error)
        }
        
    }

    return container
}

VK.getUsers = async (users, filtersList, filters, statusUpdater, filterStatusUpdater) => {
    let searchPool = []
    let finalPool = []
    users = users.map(user=>(cleanURL(user)))

    if (users.length > 500) {
      for (let i = 0; i < Math.ceil(users.length / 500); i++) {
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
        const result = await VK.call('users.get', {user_ids: usersList, fields: 'is_closed, screen_name,sex, bdate, country, city, relation, education, followers_count, can_write_private_message', name_case: 'nom', v: '5.89'})
        finalPool = finalPool.concat(result)
        statusUpdater(finalPool.length)
    } 


//Фильтрация
        if (filtersList.includes('sexFilter')) {
            finalPool = finalPool.filter(user=>user.sex === filters.sexFilter)
            filterStatusUpdater(finalPool.length)
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
            filterStatusUpdater(finalPool.length)

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
            filterStatusUpdater(finalPool.length)

        }

        if (filtersList.includes('relationFilter')) {
            finalPool = finalPool.filter(user=>filters.relationFilter.includes(user.relation))
            filterStatusUpdater(finalPool.length)

        }

        if (filtersList.includes('eduFilter')) {
            finalPool = finalPool.filter(user=> 
                (user.university_name && user.university_name.includes(filters.eduFilter)) 
                || 
                (user.faculty_name && user.faculty_name.includes(filters.eduFilter)) 
                || 
                (user.graduation && user.graduation.toString().includes(filters.eduFilter)))
            filterStatusUpdater(finalPool.length)

        }

        if (filtersList.includes('followersFilter')) {
            finalPool = finalPool.filter(user=>{
                if (filters.minFollowersFilter < filters.maxFollowersFilter) {
                    return user.followers_count > filters.minFollowersFilter && user.followers_count < filters.maxFollowersFilter
                } else if (filters.minFollowersFilter === filters.maxFollowersFilter) {
                    return user.followers_count > filters.minFollowersFilter
                } else if (filters.minFollowersFilter > filters.maxFollowersFilter) {
                    return user.followers_count > filters.minFollowersFilter
                }
            })
            filterStatusUpdater(finalPool.length)
        }

        if (filtersList.includes('canWriteFilter')) {
            finalPool = finalPool.filter(user=>user.can_write_private_message === filters.canWriteFilter)
            filterStatusUpdater(finalPool.length)
        }

        if (filtersList.includes('isClosedFilter')) {
            finalPool = finalPool.filter(user=>user.is_closed === filters.isClosedFilter)
            filterStatusUpdater(finalPool.length)
        }

        filterStatusUpdater(finalPool.length)


        return finalPool

    
}


VK.parsePostActivity = async (post, activities, activitiesCount) => {
    console.log('actvcount', activitiesCount)
    let bank = []

    let link = post.slice(post.indexOf('w=wall')+6)
    let owner_id = Number(link.slice(0, link.indexOf('_')))
    let item_id = Number(link.slice(link.indexOf('_')+1))


    if (activities.includes('likes')) {
    try {
        let likers = await VK.call('likes.getList', {type: 'post', owner_id: owner_id, item_id: item_id, count: 1000, v:'5.110'})
        if (likers.items) {
            bank = bank.concat(likers.items)
        }
    } catch (error) {
        window.alert(error.error_msg)
    }
    }

    if (activities.includes('reposts')) {
        try {
            let reposters = await VK.call('wall.getReposts', {owner_id: owner_id, post_id: item_id, count: 1000, v:'5.110'})
            if (reposters.profiles) {
                bank = bank.concat(reposters.profiles.map(el=>el.id))
            }
        } catch (error) {
            window.alert(error.error_msg)
        }
    }

    if (activities.includes('authors')) {
        try {
            let author = await VK.call('wall.getById', {posts: link, v:'5.110'})
            if (author[0].signer_id) {
                bank = bank.concat(author[0].signer_id)
            }
        } catch (error) {
            window.alert(error.error_msg)
        }
    }


    let result = {};

    bank.forEach(function(a){
    if (result[a] != undefined)
        ++result[a];
    else
        result[a] = 1;
    });

    let final = []

    for (let id in result) {

        if (result[id] >= activitiesCount) {
            final = final.concat(id)
        }
    }



    return final

    
}

VK.parsePostsActivity = async (posts, activities, activitiesCount) => {
    let result = []

    for (let post of posts) {
        let items = await VK.parsePostActivity(post, activities, activitiesCount)
        if (items) {
           result = result.concat(items)
        }
    }

    return result

}

VK.searchGroups = async (qs, params, filter, searchedUpdater, filteredUpdater) => {
    let searchedGroups = []
    let prefiltered = []

    for (let q of qs) {
        try {
            let result = await VK.call('groups.search', {q, type: params.type, country_id: params.country_id, city_id: params.city_id, sort: params.sort, count: 1000, v: '5.115'})
            searchedGroups.push(...result.items.map(item=>item.screen_name)) // В searchedGroups идут только названия
        } catch (error) {
            window.alert(error.error_msg)
        } 
        searchedUpdater(searchedGroups.length) //Обновление кол-ва найденных групп
    }

    if (searchedGroups.length > 0) {
        prefiltered = searchedGroups //Копия найденных групп

        if (filter.isClosed) {
            let quickBase = [] //Временный массив
            let arrOfStr = [] // Массив из строк по 500 шт
            for (let i = 0; i < Math.ceil(prefiltered.length); i = i+500) { //
                arrOfStr.push(prefiltered.slice(i, i+500))                  //
            }                                                               //
            for (let group_ids of arrOfStr) {
                let res = await VK.call('groups.getById', {group_ids, fields: 'is_closed', v:'5.115'})
                quickBase.push(...res.filter(gr=>gr.is_closed === 0).map(gr=>gr.screen_name)) //Только названия
            }
            prefiltered = quickBase
        }

        filteredUpdater(prefiltered.length)

        if (filter.canPost) {
            let quickBase = [] //Временный массив
            let arrOfStr = [] // Массив из строк по 500 шт
            for (let i = 0; i < Math.ceil(prefiltered.length); i = i+500) { //
                arrOfStr.push(prefiltered.slice(i, i+500))                  //
            }                                                               //
            for (let group_ids of arrOfStr) {
                let res = await VK.call('groups.getById', {group_ids, fields: 'can_post', v:'5.115'})
                quickBase.push(...res.filter(gr=>gr.can_post === 1).map(gr=>gr.screen_name)) //Только названия
            }
            prefiltered = quickBase
        }

        filteredUpdater(prefiltered.length)

        if (filter.minMembers > 0 || filter.maxMembers > 0) {
            let quickBase = [] //Временный массив
            let arrOfStr = [] // Массив из строк по 500 шт
            for (let i = 0; i < Math.ceil(prefiltered.length); i = i+500) { //
                arrOfStr.push(prefiltered.slice(i, i+500))                  //
            }                                                               //
            for (let group_ids of arrOfStr) {
                let res = await VK.call('groups.getById', {group_ids, fields: 'members_count', v:'5.115'})
                quickBase.push(...res.filter(
                    gr=>gr.members_count > filter.minMembers && (filter.minMembers < filter.maxMembers ? gr.members_count < filter.maxMembers : true)
                    ).map(gr=>gr.screen_name)) //Только названия
            }
            prefiltered = quickBase
        }


        filteredUpdater(prefiltered.length)


        return prefiltered


    }

}



let cleanPostParseUrl = (data) => {
    if (data.startsWith('https://vk.com/club')) {
        return Number('-'+data.slice(19))
    } else if (data.startsWith('https://vk.com/public')) {
        return  Number('-'+data.slice(21))
    } else if (data.startsWith('https://vk.com/group')){
        return Number('-'+data.slice(20))
    } else if (data.startsWith('https://vk.com/id')){
        return Number(data.slice(17))
    } else if (data.startsWith('https://vk.com/')){
        return data.slice(15)
    } else {
        return data
    }
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