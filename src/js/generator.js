import React from 'react/addons';

var ReactTransitionGroup = React.addons.CSSTransitionGroup

import {RouteHandler} from "react-router";
import http from 'superagent';
import katex from 'katex';
import Katex from './katex';

import {Col,Button,SplitButton,Grid,ButtonToolbar,Panel,DropdownButton,MenuItem,Modal,ModalTrigger,Table,ListGroupItem} from 'react-bootstrap';

import GeneratorStore from "./stores/generator"
import GeneratorActions from "./actions/generator"

import SettingsActions from "./actions/settings"
import SettingsStore from "./stores/settings"

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


class SettingsModal extends React.Component
{
	constructor(props){
		super(props)
		console.log(SettingsActions);
		SettingsActions.getSettings();
		this.state = SettingsStore.getState();
	}



	new(){
		SettingsActions.createSetting();
		this.setState(SettingsStore.getState())
	}

	render(){
		return (<Modal>
			<div className='modal-body' bsStyle='primary' title='Вход'>
				Настройки
				<Table responsive>
					<thead>
						<tr>
						<th>#</th>
						<th>Име на настройка</th>
						<th></th>
						</tr>
					</thead>
					<tbody>
						{this.state.settings.map((item,index) => {return <SettingsItem index={index} name={item.name}/>})}
					</tbody>
				</Table>
				<Button onClick={this.save.bind(this)}>Запази текуща</Button>

				
				<div className='modal-footer'>
					<Button onClick={this.props.onRequestHide}>Затвори</Button>

					<Button onClick={this.new.bind(this)}>Нова</Button>


				</div>
			</div>
			</Modal>
		)
	}
}

class SettingsItem extends React.Component
{
	render(){
		return(<tr>
		<td>{this.props.index}</td>
		<td>{this.props.name}</td>
		<td><a>Изтрий</a></td>
		</tr>)
	}
}


export default class Generator extends React.Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			math: {problem: "", solution: ""},
			sv: false,
			list: [],
			cor:1
		}

		this.generated = ((data) => {
			
			this.setState(GeneratorStore.getState().results);

		}).bind(this)
	
	 }

	submit(){
		var name = this.context.router.getCurrentPath();
		console.log(name)
		model = window.model
		self = this
		localStorage[model.addres] = JSON.stringify(model.data)

		GeneratorActions.requestGenerate(model.addres,model.data,this.state.cor);
	}

	componentDidMount(){
		GeneratorStore.listen(this.generated);
	}

	componentWillUnmount(){
		GeneratorStore.unlisten(this.generated);
	}

	print(){
		if(this.state.list.length > 1){

			let page =
			`
			<!DOCTYPE html>
			<head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css">
				<link rel="stylesheet" type="text/css" href="/css/main.css">
			</head>
			<body>
				${React.renderToString(<PrintableList res={this.state.list}/>)}
			</body>`;

			var w = window.open();
			w.document.write(page);
			w.print()
		}
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
								<MenuItem eventKey={5}>5</MenuItem>
								<MenuItem eventKey={10}>10</MenuItem>
								<MenuItem eventKey={20}>20</MenuItem>

							</SplitButton>

							<ToggleButton action={this.show.bind(this)} on="Скрий" off="Покажи">{'{0} отговорите'}</ToggleButton>
							<Button onClick={this.print.bind(this)}>Принтирай</Button>
							<ModalTrigger modal={<SettingsModal />}>
								<SplitButton title={"Настройки"}></SplitButton>	
							</ModalTrigger>


						</ButtonToolbar>
					</div>

					<ReactTransitionGroup transitionLeave={false} component="div" transitionName="example">
						<RouteHandler model={window.model} key={window,model.addres} check={checkStorageForDataOrReturnDefault}/>
					</ReactTransitionGroup>
				</div>		
				<PrintListComponent res={this.state.list}/>

			</Col>

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
		console.log(this.props)
		return (
			<Panel id="resCont">
				<Katex ref="problem" id="result" problem={this.props.math.problem}/>
				<Katex style={{display:this.props.solutionVisable ? "block" : "none"}} problem={this.props.math.solution}/>
			</Panel>)
	}
})

class PrintableList extends React.Component
{
	render() {
		let problems = this.props.res.map(function(result,iter){
			return (<div className="items">
				<span className="num">{iter+1}</span>
				<Katex problem={result.problem} />
				</div>)
		})

		let solution = this.props.res.map(function(result,iter){
			return (<div className="items">
				<span className="num">{iter+1}</span>
				<Katex problem={result.solution} />
				</div>)
		})


		return (

			<div className="list">
				Задачи:
				{problems}
				<br />
				Отговори:
				{solution}
			</div>
		)
	}
}

var PrintListComponent = React.createClass({
	componentDidUpdate: function(){
		let anchor = document.getElementById("jumppos");
		console.log(anchor)
		scrollTo(0,anchor.offsetTop)
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

			<div id="jumppos" style={st} className="list">
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