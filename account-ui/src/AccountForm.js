import React, {Component} from "react";
import {Button, Modal, Label, Input, Panel, FormHorizontal, Group} from "re-bulma";
import _ from "lodash";
import "./App.css";
import accountClient from "./client/AccountClient";

class AccountForm extends Component {
    constructor(props) {
        super(props);
        let account = props.account || {};
        this.state = {
            isOpen: false,
            updateButton: 'isActive',
            birthDay: account.birthDay,
            emails: account.emails || [],
            phones: account.phones || [],
            addresses: account.addresses || [],
            attributes: account.attributes || []
        };
        this.updateMe = this.updateMe.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.removeEmail = this.removeEmail.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.addAddress = this.addAddress.bind(this);
        this.removeAddress = this.removeAddress.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.addPhone = this.addPhone.bind(this);
        this.removePhone = this.removePhone.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.removeAttribute = this.removeAttribute.bind(this);
        this.handleAttributeChange = this.handleAttributeChange.bind(this);
    }

    componentDidMount() {
    }

    updateMe() {
        this.setState({
            updateButton: 'isLoading'
        });
        let account = {
            birthDay: this.state.birthDay,
            emails: this.state.emails,
            addresses: this.state.addresses,
            phones: this.state.phones,
            attributes: this.state.attributes,
        };
        accountClient.updateMe(account)
            .then(() => this.props.refreshData()
                .then(() => this.setState({
                    updateButton: 'isActive',
                    isOpen: false,
                }))
            )
            .catch(error => {
                console.error('update error!', error);
                alert('error!');
            });
    }

    formActive() {
        return this.state.updateButton === 'isActive' ? null : 'isDisabled';
    }

    addEmail() {
        this.setState({
            emails: _.concat(this.state.emails, {purpose: '', emailAddress: ''})
        });
    }

    removeEmail(i) {
        return () => {
            let emails = this.state.emails.filter((a, b) => b !== i);
            this.setState({
                emails: emails
            });
        };
    }

    handleEmailChange(field, i) {
        let email = this.state.emails[i];
        return (event) => {
            let emails = this.state.emails;
            email[field] = event.target.value;
            emails[i] = email;
            this.setState({emails: emails});
        };
    }


    addPhone() {
        this.setState({
            phones: _.concat(this.state.phones, {purpose: '', phoneNumber: ''})
        });
    }

    removePhone(i) {
        return () => {
            let phones = this.state.phones.filter((a, b) => b !== i);
            this.setState({
                phones: phones
            });
        };
    }

    handlePhoneChange(field, i) {
        let phone = this.state.phones[i];
        return (event) => {
            let phones = this.state.phones;
            phone[field] = event.target.value;
            phones[i] = phone;
            this.setState({phones: phones});
        };
    }

    addAddress() {
        this.setState({
            addresses: _.concat(this.state.addresses, {purpose: '', address: '', postcode: ''})
        });
    }

    removeAddress(i) {
        return () => {
            let addresses = this.state.addresses.filter((a, b) => b !== i);
            this.setState({
                addresses: addresses
            });
        };
    }

    handleAddressChange(field, i) {
        let address = this.state.addresses[i];
        return (event) => {
            let addresses = this.state.addresses;
            address[field] = event.target.value;
            addresses[i] = address;
            this.setState({addresses: addresses});
        };
    }

    addAttribute() {
        this.setState({
            attributes: _.concat(this.state.attributes, {attributeName: '', attributeValue: ''})
        });
    }

    removeAttribute(i) {
        return () => {
            let attributes = this.state.attributes.filter((a, b) => b !== i);
            this.setState({
                attributes: attributes
            });
        };
    }

    handleAttributeChange(field, i) {
        let attribute = this.state.attributes[i];
        return (event) => {
            let attributes = this.state.attributes;
            attribute[field] = event.target.value;
            attributes[i] = attribute;
            this.setState({attributes: attributes});
        };
    }

    handleChange(field) {
        return (event) => {
            let newState = {};
            newState[field] = event.target.value;
            this.setState(newState)
        };
    }

    render() {
        let account = this.props.account;
        return (
            <div>
                <Button color="isPrimary" onClick={() => this.setState({isOpen: true})}>編集</Button>
                {account &&
                <Modal
                    type="card"
                    isActive={this.state.isOpen}
                    onCloseRequest={() => this.setState({isOpen: false})}>
                    <Label>誕生日</Label>
                    <Input type="date"
                           value={account.birthDay}
                           state={this.formActive()}
                           onChange={this.handleChange('birthDay')}/>
                    <Label>メールアドレス <Button size="isSmall"
                                           color="isSuccess"
                                           onClick={this.addEmail}
                                           state={this.formActive()}>+</Button></Label>
                    {this.state.emails.map((e, i) => (<Panel key={i}>
                        <Button size="isSmall"
                                color="isDanger"
                                onClick={this.removeEmail(i)}
                                state={this.formActive()}>-</Button><br />
                        用途: <Input value={e.purpose}
                                   state={this.formActive()}
                                   onChange={this.handleEmailChange('purpose', i)}/>
                        アドレス: <Input value={e.emailAddress}
                                     state={this.formActive()}
                                     onChange={this.handleEmailChange('emailAddress', i)}/>
                    </Panel>))}
                    <Label>住所 <Button size="isSmall"
                                      color="isSuccess"
                                      onClick={this.addAddress}
                                      state={this.formActive()}>+</Button></Label>
                    {this.state.addresses.map((a, i) => (<Panel key={i}>
                        <Button size="isSmall"
                                color="isDanger"
                                onClick={this.removeAddress(i)}
                                state={this.formActive()}>-</Button><br />
                        用途: <Input value={a.purpose}
                                   state={this.formActive()}
                                   onChange={this.handleAddressChange('purpose', i)}/>
                        郵便番号: <Input value={a.postcode}
                                     state={this.formActive()}
                                     onChange={this.handleAddressChange('postcode', i)}/>
                        住所: <Input value={a.address}
                                   state={this.formActive()}
                                   onChange={this.handleAddressChange('address', i)}/>
                    </Panel>))}
                    <Label>電話番号 <Button size="isSmall"
                                        color="isSuccess"
                                        onClick={this.addPhone}
                                        state={this.formActive()}>+</Button></Label>
                    {this.state.phones.map((p, i) => (<Panel key={i}>
                        <Button size="isSmall"
                                color="isDanger"
                                onClick={this.removePhone(i)}
                                state={this.formActive()}>-</Button><br />
                        用途: <Input value={p.purpose}
                                   state={this.formActive()}
                                   onChange={this.handlePhoneChange('purpose', i)}/>
                        電話番号: <Input value={p.phoneNumber}
                                     state={this.formActive()}
                                     onChange={this.handlePhoneChange('phoneNumber', i)}/>
                    </Panel>))}
                    <Label>
                        任意項目 <Button size="isSmall"
                                     color="isSuccess"
                                     onClick={this.addAttribute}
                                     state={this.formActive()}>+</Button>
                    </Label>
                    {this.state.attributes.map((attr, i) => (<Panel key={i}>
                        <FormHorizontal>
                            <Group>
                                <Input value={attr.attributeName}
                                       state={this.formActive()}
                                       onChange={this.handleAttributeChange('attributeName', i)}/>
                                <Input value={attr.attributeValue}
                                       state={this.formActive()}
                                       onChange={this.handleAttributeChange('attributeValue', i)}/>
                                <Button size="isSmall"
                                        color="isDanger"
                                        onClick={this.removeAttribute(i)}
                                        state={this.formActive()}>-</Button>
                            </Group>
                        </FormHorizontal>
                    </Panel>))}
                    <Button color="isPrimary" onClick={this.updateMe} state={this.state.updateButton}>編集</Button>
                </Modal>
                }
            </div>
        );
    }
}

export default AccountForm;
