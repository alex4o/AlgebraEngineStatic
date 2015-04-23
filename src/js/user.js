import React from 'react';
import {Modal,Input,Button} from "react-bootstrap"
import UserActions from "./actions/user"
class LoginModal extends React.Component
{
	login(){
		let credentials = {
			name: this.refs.name.getInputDOMNode().value,
			pass: this.refs.pass.getInputDOMNode().value
		}
		console.log(credentials)
		UserActions.requestLogIn(credentials);
	}

	render(){
		return (
		<Modal>
			<div className='modal-body' bsStyle='primary' title='Вход'>
				<form className=''>
					<Input ref="name" type="text" label="Потребителско име"/>
					<Input ref="pass" type="password" label="Парола"/>
				</form>
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
	register(){
		let credentials = {
			name: this.refs.name.getInputDOMNode().value,
			pass: this.refs.pass.getInputDOMNode().value,
			passAgain: this.refs.passAgain.getInputDOMNode().value
		}
	}

	render(){
		return(<Modal>
			<div className='modal-body' bsStyle='primary' title='Вход'>
				<form className=''>
					<Input ref="name" type="text" label="Потребителско име"/>
					<Input ref="pass" type="password" label="Парола"/>
					<Input ref="passAgain" type="password" label="Парола (повтори)"/>

				</form>
				<div className='modal-footer'>
					<Button onClick={this.props.onRequestHide}>Затвори</Button>
					<Button bsStyle='primary' onClick={this.register.bind(this)}>Ргистряция</Button>
				</div>
			</div>
		</Modal>)
	}
}

export {RegisterModal,LoginModal}