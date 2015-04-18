import React from "react";
import {RouteHandler} from "react-router";
import http from 'superagent';
import katex from 'katex';
import Katex from './katex';

import {Col,Button,Navbar,Grid,ButtonToolbar,Panel,DropdownButton} from 'react-bootstrap';

String.prototype.format = function() {
	var str = this.toString();
	if (!arguments.length){
		return str;
	}
	var args = typeof arguments[0],args = (("string" == args || "number" == args) ? arguments : arguments[0]);
	for (let arg in args){
		str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
	}
	return str;
}


//will be replaced by Flux architectur soon
function checkStorageForDataOrReturnDefault(def){
	if(localStorage[window.model.addres] != null && localStorage[window.model.addres] != ""){
		return JSON.parse(localStorage[window.model.addres]);
	}else{
		return def
	}
}


export default class Generator extends React.Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			math: [{problem: "", solution: ""}],
			sv: false,
			list: []
		}
	}

	submit(){
		model = window.model
		self = this
		localStorage[model.addres] = JSON.stringify(model.data)
		http.post("/api" + model.addres).send(model.data).send({cor:1, token: sessionStorage.getItem("token")}).end(function(err, res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				self.setState({math: model.res})

			}else{
				self.setState({math: {problem: "error",solution:" --- "} })

				//katex.render("error",problem)


			}
		});
		//alert(math)
		//console.log(math)
		
		//this.setState({math: math})
	}

	submit_more(){
		self = this
		model = window.model

		localStorage[model.addres] = JSON.stringify(model.data)
		
		
		http.post("/api" + model.addres).send(model.data).send({cor:10, token: sessionStorage.getItem("token")}).end(function(err, res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				console.log(model.res)

				self.setState({list: model.res})
				console.log(ofset)

			}else{
				//katex.render("error",problem)


			}
		});


		//alert(math)
		//console.log(math)
	}

	show(){
		this.setState({sv: !this.state.sv});
	}

	render() {
		return (
			
			<div>

	

			<Col md={12}>
				<MathComponent math={this.state.math} solutionVisable={this.state.sv}/>

				<div>
					<div>
						<ButtonToolbar>
							<Button bsStyle='primary' onClick={this.submit.bind(this)}>Генерирай</Button>
							<Button onClick={this.submit_more.bind(this)}>Генерирай няколко</Button>
							<Togglemenuitem action={this.show.bind(this)} on="Скрий" off="Покажи">{'{0} отговорите'}</Togglemenuitem>
						</ButtonToolbar>
					</div>
					<RouteHandler model={window.model} check={checkStorageForDataOrReturnDefault}/>
				</div>		
				<PrintListComponent res={this.state.list}/>
			</Col>

			</div>
		);
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
			<Panel>
				<span id="result" ref="problem"></span>
				<span style={{display:this.props.solutionVisable ? "block" : "none"}} ref="solution"></span>
			</Panel>)
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
			return (<div className="items">
				<span className="num">{iter+1}</span>
				<Katex problem={result.problem} />
				</div>)
		})

		let solution = this.props.res.map(function(result,iter){
			//console.log(result)
			return (<div className="items">
				<span className="num">{iter+1}</span>
				<Katex problem={result.solution} />
				</div>)
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


var Togglemenuitem = React.createClass({
	getInitialState: function() {
		return {
			activated: false	
		};
	},
	call: function(activated) {
		this.props.action(this.state.activated)
		this.setState({activated: !this.state.activated})
		console.log()
	},

	render: function() {
		return <Button onClick={this.call.bind(this)}>{this.props.children.format(this.state.activated ? this.props.on : this.props.off)}</Button>;
	}
});