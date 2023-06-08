import Api from './Api'

export default {
    getAssignedSystems (user_id: string) {
        return Api().get(`users/systems/${user_id}`)
    },
    getUsersByRole (role: string) {
        return Api().get(`users/${role}`)
    }
}
