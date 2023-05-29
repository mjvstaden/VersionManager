import Api from './Api'

export default {
    index (search: string) {
        return Api().get('components/all', {
            params: {
                search: search
            }
        })
    }, 
    indexActive (search: string) {
        return Api().get('components/active', {
            params: {
                search: search
            }
        })
    },
    show (component_id: string) {
        return Api().get(`components/${component_id}`)
    },
    post (component: any) {
        return Api().post(`components`, component)
    },
    put (component: any) {
        return Api().put(`components/${component.id}`, component)
    },
    delete (component_id: number) {
        return Api().put(`components/delete/${component_id}`)
    },
    getHistory (component_id: number) {
        return Api().get(`components/history/${component_id}`)
    }
}
