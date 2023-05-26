import Api from './Api'

export default {
    index (search: string) {
        return Api().get('systems', {
            params: {
                search: search
            }
        })
    }, 
    show (system_id: string) {
        return Api().get(`systems/${system_id}`)
    },
    post (system: any) {
        return Api().post('systems', system)
    },
    put (system: any) {
        return Api().put(`systems/${system.id}`, system)
    },
    delete (system_id: string) {
        return Api().delete(`systems/${system_id}`)
    },
    loadAll () {
        return Api().get('systems/load')
    }

}
