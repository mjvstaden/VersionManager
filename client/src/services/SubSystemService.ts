import Api from './Api'

export default {
    index (search: string) {
        return Api().get('subsystems/all', {
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
    getChildren (subsystem_id: string) {
        return Api().get(`subsystems/children/${subsystem_id}`)
    },
    show (subsystem_id: string) {
        return Api().get(`subsystems/${subsystem_id}`)
    },
    post (subsystem: any) {
        return Api().post(`subsystems`, subsystem)
    },
    put (subsystem: any) {
        return Api().put(`subsystems/${subsystem.id}`, subsystem)
    },
    delete (subsystem_id: string) {
        return Api().put(`subsystems/delete/${subsystem_id}`)
    },
    getHistory (subsystem_id: string) {
        return Api().get(`subsystems/history/${subsystem_id}`)
    }
}
