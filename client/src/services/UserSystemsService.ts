import Api from './Api'

export default {
    post (userSystems: any) {
        return Api().post('usersystems', userSystems)
    }
}
