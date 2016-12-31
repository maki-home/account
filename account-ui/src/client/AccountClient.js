import axios from "axios";

const path = '/api/accounts';

function replaceLink(account) {
    account._links.account.href = account._links.account.href.replace('/v1/accounts', '');
    account._links.self.href = account._links.self.href.replace('/v1/accounts', '');
    return account;
}

class AccountClient {

    findAll() {
        return axios.get(path)
            .then(x => x.data._embedded.accounts)
            .then(x => x.map(replaceLink));
    }

    findOne(uuid) {
        return axios.get(path + '/' + uuid)
            .then(x => x.data)
            .then(replaceLink);
    }

    findByMemberId(memberId) {
        return axios.get(path + '/search/findByMemberId',
            {
                params: {
                    memberId: memberId
                }
            })
            .then(x => x.data)
            .then(replaceLink);
    }

    delete(uuid) {
        return axios.delete(path + '/' + uuid);
    }

    create(account) {
        return axios.post(path, account).then(x => x.data);
    }

    update(account) {
        return axios.put(path + '/', account).then(x => x.data);
    }
}

export default new AccountClient();