import React, {Component} from "react";
import {Button, Td, Modal, Panel, PanelHeading, PanelBlock, Tag} from "re-bulma";
import "./App.css";
import accountClient from "./client/AccountClient";

class AccountData extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false, deleteButton: 'isActive'};
        this.deleteMe = this.deleteMe.bind(this);
    }

    componentDidMount() {
    }

    deleteMe() {
        if (window.confirm('本当に削除しますか？')) {
            this.setState({
                deleteButton: 'isLoading'
            });
            accountClient.delete(this.props.account.accountId)
                .then(() => {
                        this.props.refreshData();
                    }
                );
        }

    }

    render() {
        let account = this.props.account;
        return (
            <Td>
                <Button color="isPrimary" onClick={() => this.setState({isOpen: true})}>閲覧</Button>&nbsp;
                {(this.props.isMe || this.props.isAdmin) &&
                <Button color="isDanger" onClick={this.deleteMe} state={this.state.deleteButton}>削除</Button>}
                <div>
                    <Modal
                        type="card"
                        headerContent={account.member.familyName + ' ' + account.member.givenName}
                        isActive={this.state.isOpen}
                        onCloseRequest={() => this.setState({isOpen: false})}>
                        <Panel>
                            <PanelHeading>誕生日</PanelHeading>
                            <PanelBlock>{account.birthDay}</PanelBlock>
                            <PanelHeading>メールアドレス</PanelHeading>
                            <PanelBlock>
                                <dl>
                                    {account.emails.map(e => [<dt key={e.emailAddress}><Tag
                                        color="isPrimary">{e.purpose}</Tag></dt>,
                                        <dd><a href={'mailto:' + e.emailAddress}>{e.emailAddress}</a></dd>])}
                                </dl>
                            </PanelBlock>
                            <PanelHeading>住所</PanelHeading>
                            <PanelBlock>
                                <dl>
                                    {account.addresses.map(a => [<dt key={a.address}><Tag
                                        color="isPrimary">{a.purpose}</Tag></dt>,
                                        <dd>{a.postcode} {a.address}</dd>])}
                                </dl>
                            </PanelBlock>
                            <PanelHeading>電話番号</PanelHeading>
                            <PanelBlock>
                                <dl>
                                    {account.phones.map(p => [<dt key={p.phoneNumber}><Tag
                                        color="isPrimary">{p.purpose}</Tag></dt>,
                                        <dd><a href={'tel:' + p.phoneNumber}>{p.phoneNumber}</a></dd>])}
                                </dl>
                            </PanelBlock>
                            {account.attributes.map(attr => [
                                <PanelHeading key={attr.attributeName}>{attr.attributeName}</PanelHeading>,
                                <PanelBlock>{attr.attributeValue}</PanelBlock>
                            ])}
                        </Panel>
                    </Modal>
                </div>
            </Td>

        );
    }
}

export default AccountData;
