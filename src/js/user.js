import React from 'react';
import ReactDOM from 'react-dom';
import {Modal,Input,Button,Alert} from "react-bootstrap"
import UserActions from "./actions/user"
import alt from "./alt"
import UserStore from "./stores/user"
import UserRegisterStore from "./stores/userRegister"

class LoginModal extends React.Component
{
	componentDidMount() {

	}

	show() {
		this.setState({show: true});
		UserStore.listen(this.change)

	}

	hide() {
		this.setState({show: false});
		UserStore.unlisten(this.change)
	}

	change(){
		let state = UserStore.getState()
		console.log(state)
		if(state.error == null){
			this.hide()
		}else{
			this.setState({ok: false, error: state.error})
		}
	}

	error(error){
		console.log(error.error)
		this.setState(error)
	}

	componentDidUpdate(pProps, pState){
		if(this.refs.name != undefined) this.refs.name.getInputDOMNode().focus()

	}

	constructor(props){
		super(props);
		this.state = {
			show: false,
			ok: true
		}

		this.change = this.change.bind(this)
	}

	onHide(){

	}

	login(){
		let credentials = {
			name: this.refs.name.getInputDOMNode().value,
			pass: this.refs.pass.getInputDOMNode().value
		}
		console.log(credentials)
		UserActions.login(credentials);
	}

	handleAlertDismiss(){
		this.setState({ok: true})
	}

	render(){
		let alert;
		if(!this.state.ok){
			alert = <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>{this.state["error"]}</Alert>
		}


		return (
		<Modal show={this.state.show} onHide={this.onHide.bind(this)}>
			<div className='modal-body' bsStyle='primary' title='Вход'>
				<form className=''>
					<Input ref="name" type="text" label="Потребителско име"/>
					<Input ref="pass" type="password" label="Парола"/>
				</form>
				{alert}
				<div className='modal-footer'>
					<Button onClick={this.hide.bind(this)}>Затвори</Button>
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
		this.change = () => {
			let state = UserStore.getState();
			console.log(state)
			if(state.error == null){
				this.hide();
			}else{
				this.setState({ok: false, error: state.error})
			}
		}.bind(this)
		this.state = {
			ok: true
		}

	}

	show() {
		this.setState({show: true});
		UserRegisterStore.listen(this.change)

	}

	hide() {
		this.setState({show: false});
		UserRegisterStore.unlisten(this.change)
	}

	componentDidMount() {

	}

	componentWillUnmount(){
	}

	componentDidUpdate(pProps, pState){
		if(this.refs.name != undefined) this.refs.name.getInputDOMNode().focus()
	}


	register(){
		let credentials = {
			name: this.refs.name.getInputDOMNode().value,
			pass: this.refs.pass.getInputDOMNode().value,
			passAgain: this.refs.passAgain.getInputDOMNode().value
		}
		UserActions.register(credentials)

	}

	onHide(){
		ErrorStore.unlisten(this.error)
	}

	handleAlertDismiss(){
		this.setState({ok: true})
	}

	render(){
		console.log(this.state)
		let alert;
		if(!this.state.ok){
			alert = <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>{this.state.error}</Alert>
		}
		return(<Modal show={this.state.show} onHide={this.onHide.bind(this)}>
			<div className='modal-body' bsStyle='primary' title='Вход'>
				<form className=''>
					<Input ref="name" type="text" label="Потребителско име"/>
					<Input ref="pass" type="password" label="Парола"/>
					<Input ref="passAgain" type="password" label="Парола (повтори)"/>

				</form>
				{alert}
				<div className='modal-footer'>
					<Button onClick={this.hide.bind(this)}>Затвори</Button>
					<Button bsStyle='primary' onClick={this.register.bind(this)}>Регистрация</Button>
				</div>
			</div>
		</Modal>)
	}
}

export {RegisterModal,LoginModal}