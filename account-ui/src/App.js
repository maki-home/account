import React, {Component} from "react";
import {Container, Button, Table, Thead, Tbody, Tr, Th, Td, Title, Subtitle} from "re-bulma";
import _ from "lodash";
import axios from "axios";
import "./App.css";
import AccountData from "./AccountData";
import AccountForm from "./AccountForm";
import accountClient from "./client/AccountClient";
import memberClient from "./client/MemberClient";
import userinfoClient from "./client/UserinfoClient";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userinfo: {name: {givenName: '', familyName: ''}, email: 'Now Loading...', id: null},
            accounts: [],
            loadUserinfo: false,
            loadAccounts: false,
            initButton: 'isActive',
        };
        this.fetch = this.fetch.bind(this);
        this.initAccount = this.initAccount.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.fetch();
    }

    initAccount() {
        this.setState({
            initButton: 'isLoading'
        });
        accountClient.createMe({
            emails: [{
                purpose: 'Main',
                emailAddress: this.state.userinfo.email
            }]
        })
            .then(() => this.fetch()
                .then(() => this.setState({
                    initButton: 'isActive'
                })));
    }

    fetch() {
        let accounts = accountClient.findAll()
            .then(accounts => {
                let ids = accounts.map(a => a.memberId);
                return memberClient.findByMemberIds(ids)
                    .then(members => {
                        let memberMap = _.keyBy(members, m => m.memberId);
                        return _.sortBy(accounts.map(a => {
                            a.member = memberMap[a.memberId] || {givenName: null, familyName: null};
                            return a;
                        }), [a => a.member.familyName, a => a.member.givenName]);
                    });
            })
            .then(a => {
                this.setState({accounts: a, loadAccounts: true});
            })
            .catch(error => {
                console.error('accounts error!', error);
            });
        let userinfo = userinfoClient.find()
            .then(userinfo => {
                this.setState({userinfo: userinfo, loadUserinfo: true});
            })
            .catch(error => {
                console.error('userinfo error!', error);
            });
        return axios.all([accounts, userinfo]);
    }


    logout(event) {
        event.preventDefault();
        const pattern = /XSRF-TOKEN=([a-z\-0-9]+)/;
        const token = pattern.exec(document.cookie)[1];
        let form = event.target;
        form._csrf.value = token;
        form.action = '/logout';
        form.method = 'post';
        event.target.submit();
    }

    render() {
        let loaded = this.state.loadAccounts && this.state.loadUserinfo;
        let me = _.find(this.state.accounts, a => a.member.memberId === this.state.userinfo.id);
        console.log(me);
        let showInit = loaded && !me;
        let accounts = this.state.accounts.map(a => {
            let displayName = a.member ? (a.member.familyName + ' ' + a.member.givenName) : '--';
            return (
                <Tr key={a.accountId}>
                    <Td>{displayName}</Td>
                    <AccountData account={a}
                                 isAdmin={me && _.indexOf(me.member.roles, 'ADMIN') >= 0}
                                 isMe={me === a}
                                 refreshData={this.fetch}/>
                </Tr>);
        });
        return (
            <Container>
                <Title>アカウント管理</Title>
                <Subtitle>{this.state.userinfo.name.familyName + ' ' + this.state.userinfo.name.givenName}
                    &nbsp;({this.state.userinfo.email})</Subtitle>
                <br />
                {showInit ?
                    <Button color="isSuccess" onClick={this.initAccount} state={this.state.initButton}>初期登録</Button> :
                    (me && <AccountForm account={me} refreshData={this.fetch}/>)}
                <Table isNarrow>
                    <Thead>
                    <Tr>
                        <Th>名前</Th>
                        <Th>&nbsp;</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {accounts}
                    </Tbody>
                </Table>
                <form onSubmit={this.logout}>
                    <Button>Logout</Button>
                    <input type="hidden" name="_csrf"/>
                </form>
            </Container>
        );
    }
}

export default App;
