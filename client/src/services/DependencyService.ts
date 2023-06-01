import Api from './Api'

export default {
    index (search: string) {
        return Api().get('dependencies/all', {
            params: {
                search: search
            }
        })
    }, 
    indexActive (search: string) {
        return Api().get('subsystems/active', {
            params: {
                search: search
            }
        })
    },
    show (sourceId: string, targetId: string) {
        return Api().get(`dependencies/${sourceId}/${targetId}`)
    },
    post (dependency: any) {
        return Api().post(`dependencies`, dependency)
    },
    put (dependency: any) {
        return Api().put(`dependencies/${dependency.id}`, dependency)
    },
    delete (dependencyId: string) {
        return Api().delete(`dependencies/${dependencyId}`)
    },
}
