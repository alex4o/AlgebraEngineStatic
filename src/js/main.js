import React from 'react';
import ReactDOM from 'react-dom';

import Router, {Route,DefaultRoute,NotFoundRoute,RouteHandler,Transition} from "react-router";



import {Alert,Button,Navbar,Grid,NavItem,Nav,DropdownButton,Input,ModalTrigger,NavBrand,NavDropdown,MenuItem} from 'react-bootstrap';

//components
import {LoginModal,RegisterModal} from "./user";
import Problems from "./problems";
import Home from "./home";

import Generator from "./generator"

import EquivalentExpressions from"./view/EquivalentExpressions.js"
import Equation from "./view/Equation.js"
import Inequation from "./view/Inequation.js"

import Katex from "./katex.js"
import katex from "katex"

import UserActions from "./actions/user"
import UserStore from "./stores/user"



window.model = {
	data: {

	},
	addres: ""
}

class App extends React.Component
{
	constructor(props){
		super(props)
		this.state = {
			showLogin: false,
			showRegister: false,
			login: UserStore.getState()
		}
	}

	openMenu(){
		this.refs.menu.show()
	}

	showLogin(){
		this.refs.login.show()
	}

	showRegister(){
		this.refs.register.show()
	}

	componentWillMount(){
		UserStore.listen((data) => {
			console.log("update view");
			this.setState({login: UserStore.getState()})
		})


	}

	renderUserPane(){
		if(this.state.login.user != null){
			return (<Nav right eventKey={0}>
						<NavDropdown id="user-logged-dropdown" navItem={true} title={this.state.login.user.name}>
							<li onClick={this.exit}><a>Изход</a></li>
						</NavDropdown>
					</Nav>
				)
		}else{
			return(<Nav right eventKey={0}>
						<NavItem onClick={this.showLogin.bind(this)}>Вход</NavItem>
						<NavItem onClick={this.showRegister.bind(this)}>Регистрация</NavItem>
					</Nav>
				)
		}

	}

	componentDidMount(){
		
	}

	exit(){
		UserActions.exit()
	}

	render() {
		return (
		<div>
			<Navbar inverse staticTop toggleNavKey={0}>
				<NavBrand>Мат&Sigma;матика за всички</NavBrand>
					<Nav left>
						<NavItem eventKey={1} href='#'>Начало</NavItem>
						<NavDropdown eventKey={2} onSelect={(ev, href) => {window.location.hash = href}} title="Генератор" id="nav-dropdown-type">
							<MenuItem eventKey='#/Problem/EquivalentExpressions'>Tъждествени изрази</MenuItem>
							<MenuItem eventKey='#/Problem/Equation'>Уравнения</MenuItem>
							<MenuItem eventKey='#/Problem/Inequation'>Неравенства</MenuItem>

						</NavDropdown>
						<NavItem eventKey={3} href='#/Problems'>Задачи</NavItem>
					</Nav>
					{ this.renderUserPane() }

			</Navbar>
			<Grid>
				<RouteHandler/>
			</Grid>
			<LoginModal ref="login" show={this.state.showLogin} />
			<RegisterModal ref="register" show={this.state.showRegister} />


		</div>
		);
	}
}

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} />
    <Route name="" path="/Problems" handler={Problems} />

    <Route name="problems" handler={Generator}>
      <Route name="" path="/Problem/Equation" handler={Equation} />
      <Route name="" path="/Problem/EquivalentExpressions" handler={EquivalentExpressions} />
      <Route name="" path="/Problem/Inequation" handler={Inequation} />


    </Route>
  </Route>
);

Router.run(routes, function (Handler,state) {
	//console.log("Router:",Handler, state)
	UserActions.checkLogin();
	ReactDOM.render(<Handler/>, document.getElementById("app"));
});

//React.render(<App/>,document.body)
