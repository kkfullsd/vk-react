let VK = {}

// VK.call = (method, params, callback) => {
//     window.VK.Api.call(method, params, (r)=>{ if (r.response) {
//         callback(r.response)
//         } else {
//             callback(r.error)
//         }
//     })
// }

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