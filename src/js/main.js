import React from 'react';
import Router, {Route,DefaultRoute,NotFoundRoute,RouteHandler} from "react-router";

import {Alert,Button,Navbar,Grid,NavItem,Nav,DropdownButton,Input,ModalTrigger} from 'react-bootstrap';

//components
import {LoginModal,RegisterModal} from "./user";
import Problems from "./problems";
import Home from "./home";

import Generator from "./generator"

import EquivalentExpressions from"./view/EquivalentExpressions.js"
import Equation from "./view/Equation.js"
import Katex from "./katex.js"
import katex from "katex"

import UserActions from "./actions/user"
import UserStore from "./stores/user"



window.model = {
	data: {

	},
	addres: "",
	user: {
		name: "",
		pass: ""
	},
	res :{

	}
}

/*
unused router may develop in future

var ViewChanger = React.createClass({

	render: function () {
		console.log(this.props)
		if(this.props.id < this.props.views.length){
			return (React.createElement(this.props.views[this.props.id],{model:model}));
		}else{
			return <div></div>
		}
	}
});
*/

var App = React.createClass({
	getInitialState: function(){
		return {
			user: ""
		}
	},
	openMenu: function(){
		this.refs.menu.show()
	},
	componentDidMount: function(){
		self = this
		UserStore.listen((data) => {
			console.log(data);
			console.log(UserStore.getState());
			this.setState(UserStore.getState().data)
		})
	},
	render: function () {
		let user;
		if(this.state.user == ""){
			user = (<Nav right eventKey={0}>
					<ModalTrigger modal={<LoginModal />}>
						<li><a>Вход</a></li>
					</ModalTrigger>
					<ModalTrigger modal={<RegisterModal />}>
						<li><a>Регистрация</a></li>
					</ModalTrigger>
				</Nav>
				)
		}else{
			user = (<Nav right eventKey={0}>
				<DropdownButton navItem={true} title={this.state.user}>
					<NavItem>Изход</NavItem>
				</DropdownButton>
				</Nav>
				)
		}
		return (
		<div>

		<Navbar inverse staticTop brand='Математика за всички' toggleNavKey={0}>
			
				<Nav left>
					<NavItem eventKey={1} href='#'>Начало</NavItem>
					<DropdownButton eventKey={2} href='#/Problem' navItem={true} title="Генератор">
						<NavItem eventKey="2.1" href='#/Problem/EquivalentExpressions'>Tъждествени изрази</NavItem>
						<NavItem eventKey="2.2" href='#/Problem/Equation'>Уравнения</NavItem>
					</DropdownButton>
					<NavItem eventKey={3} href='#/Problems'>Задачи</NavItem>
				</Nav>
				{user}
		</Navbar>



		<Grid>
			<RouteHandler/>
		</Grid>					
				
			

		</div>


		);
	}
});


var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} />
    <Route name="" path="/Problems" handler={Problems} />

    <Route name="problems" handler={Generator}>
      <Route name="" path="/Problem/Equation" handler={Equation} />
      <Route name="" path="/Problem/EquivalentExpressions" handler={EquivalentExpressions} />
    </Route>
  </Route>
);

Router.run(routes, function (Handler,state) {
	React.render(<Handler/>, document.body);
});

//React.render(<App/>,document.body)

