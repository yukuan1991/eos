//接收store 发送来的action  commit

export default {
    adminLogin(state, json) {
        state.loginResult = json
    },
    userLogin(state, json) {
        state.loginResult = json
    },
    getUser(state, json) {
        state.userAll = json
    },
    delUser(state, json) {
        state.userId = json
    },
    addUser(state, json) {

    },
    updateUserById(state, json) {

    },
    selectAreaAll(state, json) {
        state.areaAll = json
    },
    selectUserById(state, json) {
        let str = ""
        state.userinfor = json.user
        state.validarea = json.validarea
        json.validmenu.forEach((item) => {
            if (str == null || str == '') {
                str += item.validmenuid
            } else {
                str += "," + item.validmenuid;
            }
        });
        return state.validmenu = str
    },
    selectKPIALL(state, json) {
        state.kpiAll = json
    },
    addFactoryOne(state, json) {},
    findAndCount(state, json) {
        // let arr = []
        state.count = json.count
        state.userAll = json.rows
            // json.rows.forEach((item) => {
            //     arr.push(item)
            // });
            // return state.userAll = arr
    }
}