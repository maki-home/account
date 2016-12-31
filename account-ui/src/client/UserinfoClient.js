import axios from "axios";

const path = '/api/userinfo';

class UserinfoClient {

    find() {
        return axios.get(path)
            .then(x => x.data);
    }

}

export default new UserinfoClient();