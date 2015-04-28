import React from 'react';
import {Modal,Input,Button,Alert} from "react-bootstrap"
import UserActions from "./actions/user"
import alt from "./alt"
import UserErrorStore from "./stores/error"



class LoginModal extends React.Component
{
	componentDidMount() {
		this.refs.name.getInputDOMNode().focus();

	}

	constructor(props){
		super(props);
		this.error = () => {
			let state = UserErrorStore.getState();
			console.log(state);
			this.setState(state);

		}.bind(this)

	}

	componentWillUnmount(){
		UserErrorStore.unlisten(this.error)
	}

	login(){
		let credentials = {
			name: this.refs.name.getInputDOMNode().value,
			pass: this.refs.pass.getInputDOMNode().value
		}
		console.log(credentials)
		UserActions.requestLogIn(credentials);

		UserErrorStore.listen(this.error);
	}

	render(){
		let alert;
		if(this.state != null){
			alert = <AlertDismissable>{this.state["error"]}</AlertDismissable>
		}


		return (
		<Modal>
			<div className='modal-body' bsStyle='primary' title='Вход'>
				<form className=''>
					<Input ref="name" type="text" label="Потребителско име"/>
					<Input ref="pass" type="password" label="Парола"/>
				</form>
				{alert}
				<div className='modal-footer'>
					<Button onClick={this.props.onRequestHide}>Затвори</Button>
					<Button bsStyle='primary' onClick={this.login.bind(this)}>Влез</Button>
				</div>
			</div>
		</Modal>);

	}
}

class RegisterModal extends React.Component
{
	constructor(props){
		super(props);
		this.error = () => {
			let state = UserErrorStore.getState();
			if(state.ok){
				this.props.onRequestHide();
			}else{
				this.setState(state);
			}
		}.bind(this)
		this.state = {
			ok: true
		}

	}

	componentDidMount() {
		this.refs.name.getInputDOMNode().focus();
		UserErrorStore.listen(this.error);

		//actionListener.addActionListener(UserActions)
	}

	componentWillUnmount(){
		UserErrorStore.unlisten(this.error)
	}


	register(){
		let credentials = {
			name: this.refs.name.getInputDOMNode().value,
			pass: this.refs.pass.getInputDOMNode().value,
			passAgain: this.refs.passAgain.getInputDOMNode().value
		}
		UserActions.requestRegister(credentials);

	}

	render(){
		console.log(this.state)
		let alert;
		if(!this.state.ok){
			alert = <AlertDismissable>{this.state.error}</AlertDismissable>
		}
		return(<Modal>
			<div className='modal-body' bsStyle='primary' title='Вход'>
				<form className=''>
					<Input ref="name" type="text" label="Потребителско име"/>
					<Input ref="pass" type="password" label="Парола"/>
					<Input ref="passAgain" type="password" label="Парола (повтори)"/>

				</form>
				{alert}
				<div className='modal-footer'>
					<Button onClick={this.props.onRequestHide}>Затвори</Button>
					<Button bsStyle='primary' onClick={this.register.bind(this)}>Регистрация</Button>
				</div>
			</div>
		</Modal>)
	}
}

const AlertDismissable = React.createClass({
	getInitialState() {
		return {
			alertVisible: true
		};
	},

	render() {
		if (this.state.alertVisible) {
			return (
				<Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
					{this.props.children}
				</Alert>
			);
		}else{
			return (
				<div></div>
			)
		}
	},

	handleAlertDismiss() {
		this.setState({alertVisible: false});
	},

	handleAlertShow() {
		this.setState({alertVisible: true});
	}
});



export {RegisterModal,LoginModal}