import axios from "axios";

const path = '/api/members';

function replaceLink(member) {
    member._links.member.href = member._links.member.href.replace('/uaa/v1/members', '');
    member._links.self.href = member._links.self.href.replace('/uaa/v1/members', '');
    return member;
}

class MemberClient {

    findAll() {
        return axios.get(path)
            .then(x => x.data._embedded.members)
            .then(x => x.map(replaceLink));
    }

    findOne(uuid) {
        return axios.get(path + '/' + uuid)
            .then(x => {
                return x.data;
            })
            .then(replaceLink);
    }

    findByMemberIds(ids) {
        return axios.get(path + '/search/findByIds',
            {
                params: {
                    ids: ids.join(',')
                }
            })
            .then(x => x.data._embedded.members)
            .then(x => x.map(replaceLink));
    }
}

export default new MemberClient();