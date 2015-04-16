import React from 'react';
import Router, {Route,DefaultRoute,NotFoundRoute,RouteHandler} from "react-router";


//components
import UserForm from "./user";
import Problems from "./problems";
import Home from "./home";

import Generator from "./generator"

import EquivalentExpressions from"./view/EquivalentExpressions.js"
import Equation from "./view/Equation.js"
import katex from "./katex.js"



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

if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length){
            return str;
        }
        var args = typeof arguments[0],args = (("string" == args || "number" == args) ? arguments : arguments[0]);

        for (let arg of args){
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), arg);
        }
        return str;
    }
}

function checkStorageForDataOrReturnDefault(def){
	if(localStorage[window.model.addres] != null && localStorage[window.model.addres] != ""){
		return JSON.parse(localStorage[window.model.addres]);
	}else{
		return def
	}
}

var MathComponent = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.math !== this.props.math || nextProps.solutionVisable !== this.props.solutionVisable;
	},
	componentDidUpdate:function(prevProps, prevState){

		var problem = this.refs.problem.getDOMNode()
		var solution = this.refs.solution.getDOMNode()
		if(this.props.math !== prevProps.math){
			katex.render(this.props.math[0].solution,solution)
			katex.render(this.props.math[0].problem,problem)
		}
	},
	componentDidMount: function() {
		this.refs.problem.getDOMNode().innerHTML = "За да създадете задача натиснете генерирай"
	},
	render: function(){
		return (
			<div id="MathContainer">
				<span id="result" ref="problem"></span>
				<span style={{display:this.props.solutionVisable ? "block" : "none"}} ref="solution"></span>
			</div>)
	}
})



var PrintListComponent = React.createClass({
	componentDidUpdate: function(){
		ofset = document.getElementById("anchor").offsetTop;
		scrollTo(0,ofset)
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.res !== this.props.res;
	},
	render: function () {
		let problems = this.props.res.map(function(result,iter){
			//console.log(result)
			return (<div className="items"><span className="num">{iter+1}</span><katex problem={result.problem} /></div>)
		})

		let solution = this.props.res.map(function(result,iter){
			//console.log(result)
			return (<div className="items"><span className="num">{iter+1}</span><katex problem={result.solution} /></div>)
		})
		var st = {}
		if(this.props.res.length > 0){
			st["display"] = "block"


		}else{
			st["display"] = "none"
		}

		return (

			<div id="anchor" style={st} className="list">
				Задачи:
				{problems}
				<br />
				Отговори:
				{solution}
			</div>
		)
	}
});



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
unused code maybe develop in future

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
				<logo onClick={this.openMenu}>
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

