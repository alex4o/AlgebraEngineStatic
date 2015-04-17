import React from 'react';
import Router, {Route,DefaultRoute,NotFoundRoute,RouteHandler} from "react-router";


//components
import UserForm from "./user";
import Problems from "./problems";
import Home from "./home";

import Generator from "./generator"

import EquivalentExpressions from"./view/EquivalentExpressions.js"
import Equation from "./view/Equation.js"
import Katex from "./katex.js"
import katex from "katex"


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



var MenuList = React.createClass({
	getInitialState: function () {
		return {
			selected: model.view_id
		};
	},
	change: function(index){
		console.log(index)
		this.setState({selected: index})
	},
	render: function(){
		var self = this;
		var list = this.props.items.map(function(item,index){
			var style = ""
			if(self.state.selected == index){
				style = "selected"
			}
			return <a className={style} href={item.href} onClick={self.change.bind(self,index)}>{item.text}</a>
		})
		return (<div>{list}</div>)
	}
}) 


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

var Menu = React.createClass({
	getInitialState: function() {
		return {
			visible: false	
		};
	},

	show: function() {
		this.setState({ visible: true });
		document.addEventListener("click", this.hide);
	},

	hide: function() {
		document.removeEventListener("click", this.hide);
		this.setState({ visible: false });
	},

	render: function() {
		return (
		<div className="">
			<div className={"slide-menu-"+(this.state.visible ? "visible " : "")+ " slide-menu"}>
				{this.props.children}
			</div>
		</div>);
	}
});

var MenuItem = React.createClass({
	navigate: function(hash) {
		window.location.hash = hash;
	},

	render: function() {
		return <div className="slide-menu-item" onClick={this.navigate.bind(this, this.props.hash)}>{this.props.children}</div>;
	}
});

var App = React.createClass({
	getInitialState: function(){
		return {
			page: 0,
		}
	},
	openMenu: function(){
		this.refs.menu.show()
	},
	componentDidMount: function(){
		self = this
	},
	render: function () {
		return (<div>

		<nav>
			<div id="select">
				<burger onClick={this.openMenu}>

				</burger>
				<logo >
					Математика за всички
				</logo>
				<div id="user" style={{float:"right"}}>
					<UserForm data={model.user}/>
				</div>
			</div>

		</nav>


		<div id="content">
				<Menu ref="menu">
						<MenuItem hash="#/">Начало</MenuItem>

						<MenuItem hash="#/Problem/EquivalentExpressions">Tъждествени изрази</MenuItem>
						<MenuItem hash="#/Problem/Equation">Уравнения</MenuItem>

						<MenuItem hash="#/Problems">Генерирани</MenuItem>
						

					</Menu>
					<RouteHandler/>
		</div>
				
			

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

