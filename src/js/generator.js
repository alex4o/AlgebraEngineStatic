import React from 'react/addons';

var ReactTransitionGroup = React.addons.CSSTransitionGroup

import {RouteHandler} from "react-router";
import http from 'superagent';
import katex from 'katex';
import Katex from './katex';

import {Col,Button,SplitButton,Grid,ButtonToolbar,Panel,DropdownButton,MenuItem} from 'react-bootstrap';

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
			list: [],
			cor:1
		}
	}

	submit(){
		var name = this.context.router.getCurrentPath();
		console.log(name)
		model = window.model
		self = this
		localStorage[model.addres] = JSON.stringify(model.data)
		var update = (val) => {
			self.setState({math: val})
		}
		if(this.state.cor > 1){
			update = (val) => {
				self.setState({list: val})
			}
		}

		http.post("/api" + model.addres).send(model.data).send({cor: this.state.cor, token: sessionStorage.getItem("token")}).end(function(err, res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				update(model.res)
			}else{
				self.setState({math: [{problem: "error",solution:" --- "}] })
			}
		});
	}

	show(){
		this.setState({sv: !this.state.sv});
	}

	change(event){
		this.setState({cor: event});
	}

	render() {
		return (
			<div>
			<Col md={12}>
				<MathComponent math={this.state.math} solutionVisable={this.state.sv}/>

				<div>
					<div>
						<ButtonToolbar>
							<SplitButton bsStyle='primary' onSelect={this.change.bind(this)} onClick={this.submit.bind(this)} title={"Генерирай " + this.state.cor}>
								<MenuItem eventKey={1}>1</MenuItem>
								<MenuItem eventKey={10}>10</MenuItem>
								<MenuItem eventKey={25}>25</MenuItem>
							</SplitButton>
							<ToggleButton action={this.show.bind(this)} on="Скрий" off="Покажи">{'{0} отговорите'}</ToggleButton>
						</ButtonToolbar>
					</div>

					<ReactTransitionGroup transitionLeave={false} component="div" transitionName="example">
						<RouteHandler model={window.model} key={window,model.addres} check={checkStorageForDataOrReturnDefault}/>
					</ReactTransitionGroup>
				</div>		
			</Col>
				<PrintListComponent res={this.state.list}/>

			</div>
		);
	}
}

Generator.contextTypes = {
	router: React.PropTypes.func
};

var MathComponent = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.math !== this.props.math || nextProps.solutionVisable !== this.props.solutionVisable;
	},
	componentDidMount: function() {
		console.log(React.findDOMNode(this.refs.problem))
		React.findDOMNode(this.refs.problem).innerHTML = "За да създадете задача натиснете генерирай"
	},
	render: function(){
		return (
			<Panel>
				<Katex ref="problem" id="result" problem={this.props.math[0].problem}/>
				<Katex style={{display:this.props.solutionVisable ? "block" : "none"}} problem={this.props.math[0].solution}/>
			</Panel>)
	}
})

var PrintListComponent = React.createClass({
	componentDidUpdate: function(){
		let ofset = document.getElementById("anchor").offsetTop;
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


var ToggleButton = React.createClass({
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
		return <Button onClick={this.call}>{this.props.children.format(this.state.activated ? this.props.on : this.props.off)}</Button>;
	}
});