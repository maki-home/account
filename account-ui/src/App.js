import React, {Component} from "react";
import {Container, Button, Table, Thead, Tbody, Tr, Th, Td, Title, Subtitle, Modal, Content} from "re-bulma";
import _ from "lodash";
import "./App.css";
import accountClient from "./client/AccountClient";
import memberClient from "./client/MemberClient";
import userinfoClient from "./client/UserinfoClient";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userinfo: {name: {givenName: '', familyName: ''}, email: 'Now Loading...', id: ''},
            accounts: [],
            isOpen: false,
        };
        this.fetch = this.fetch.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.fetch();
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
            });
        accounts
            .then(a => {
                this.setState({accounts: a});
                console.log(this.state);
            })
            .catch(error => {
                console.error('accounts error!', error);
            });
        userinfoClient.find()
            .then(userinfo => {
                this.setState({userinfo: userinfo});
                console.log(this.state);
            })
            .catch(error => {
                console.error('userinfo error!', error);
            });
    }

    logout(event) {
        event.preventDefault();
        const pattern = /XSRF-TOKEN=([a-z\-0-9]+)/;
        const token = pattern.exec(document.cookie)[1];
        let form = event.target;
        form._csrf.value = token;
        form.action = '/logout';
        form.method = 'post';
        console.log(form);
        event.target.submit();
    }

    render() {
        let accounts = this.state.accounts.map(a => {
            let displayName = a.member ? (a.member.familyName + ' ' + a.member.givenName) : '--';
            return (
                <Tr key={a.accountId}>
                    <Td>{displayName}</Td>
                    <Td>
                        <Button color="isPrimary">View</Button>
                    </Td>
                </Tr>);
        });
        return (
            <Container>
                <Title>Account</Title>
                <Subtitle>{this.state.userinfo.name.familyName + ' ' + this.state.userinfo.name.givenName}
                    &nbsp;({this.state.userinfo.email})</Subtitle>
                <Table isNarrow>
                    <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>&nbsp;</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {accounts}
                    </Tbody>
                </Table>
                <div>
                    <Button onClick={() => this.setState({isOpen: true})}>Open</Button>
                    <Modal
                        type="card"
                        headerContent="Header Content"
                        footerContent={<div style={{padding: '20px'}}>footercontent</div>}
                        isActive={this.state.isOpen}
                        onCloseRequest={() => this.setState({isOpen: false})}>
                        <Content>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices
                            eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. Ut vulputate
                            semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.
                        </Content>
                    </Modal>
                </div>
                <form onSubmit={this.logout}>
                    <Button>Logout</Button>
                    <input type="hidden" name="_csrf"/>
                </form>
            </Container>
        );
    }
}

export default App;
