import React from 'react';
import ReactDOM from 'react-dom';

import Addons from "react-addons"
var ReactTransitionGroup = Addons.CSSTransitionGroup

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


//will be replaced by Flux architectur soon. Or just integrate flux in this.
function checkStorageForDataOrReturnDefault(def){
	let state = SettingsStore.getState()
	if(state.settings[state.selectedType] == null || state.settings[state.selectedType].length == 0){
		console.log("Settings: using default")
		SettingsActions.add(state.selectedType, def, "Стандартна")
		SettingsActions.select(0);
		return def
	}else{
		console.log("Settings: using saved")
		return state.settings[state.selectedType][0].setting;
	}
}

export default class Generator extends React.Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			math: {problem: "", solution: ""},
			list: [],
			cor:1,
			settings: [],
			selectedSetting: {},
			selectedSettingIndex: 0,
			path: "",
			error: false
		}

		this.settings = ((data) => {
			console.log("Settings: updated")
			this.setState(SettingsStore.getState());
		}).bind(this)

		this.generated = ((data) => {
			this.setState(GeneratorStore.getState());
		})
	
	}


	errorCheck(isErrorPresent,error,callback,value){
		if(isErrorPresent){
			this.setState({error: true});
			error();

		}else{
			this.setState({error: false});
			callback(value);
		}
	}

	numberTransform(value,callback,error){
		let res = parseInt(value.trim(),10);
		this.errorCheck(isNaN(value) || res == NaN || value.trim() == "",error,callback,res);
	}

	charCheck(value,callback,error){
		this.errorCheck(value.length != 1 || value.match(/[a-zA-Z]/i) == null,error,callback,value);
	}

	stringCheck(value,callback,error){
		this.errorCheck(!(/^[a-zA-Z]*$/ .test(value)),error,callback,value);
	}

	submit(){
		console.log(name)
		SettingsActions.save(this.state.selectedType, this.state.selectedSetting, this.state.selectedSettingIndex)
		GeneratorActions.generate(this.state.selectedType, this.state.selectedSetting, this.state.cor);
	}



	componentWillMount(){
		console.log("Generator: mounting")
		SettingsStore.listen(this.settings);
		GeneratorStore.listen(this.generated);
	}

	componentDidMount(){
		console.log("Generator: mounted")
	}

	componentWillUnmount(){
		GeneratorStore.unlisten(this.generated);
		SettingsStore.unlisten(this.settings);
	}

	subViewChanged(path){
		console.log("Subview: changed")
		SettingsActions.load(path);
		//this.setState({path: path});
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
		this.refs.math.toggle();

		
	}

	settingSelected(event, key){
		if(key != null){
			console.log("Settings: selected (" + key + ")")
			SettingsActions.select(key)
			this.setState({selectedSettingIndex: key})
		}
	}

	settingNew(event){
		alert("New setting will be crated. Please stand by.")
		var name = prompt("Name:")
		if(name == null || name.length == 0){
			return;
		}
		SettingsActions.add(this.state.selectedType, this.state.selectedSetting, name)
	}

//cor == count of return
	changeCor(event,key){
		console.log(event, key)
		this.setState({cor: key})
	}

	renderSettingsMenu(){
		let settings = this.state.settings[this.state.selectedType]
		if(settings == null){
			return(<span />)
		}
		if(settings.length == 0){
			return(<span />)
		}

		return(
			<SplitButton id="settings-dropdown" title={"Настройки"} onSelect={this.settingSelected.bind(this)}>
				{settings.map((item,index) => {
					return <MenuItem key={index} eventKey={index}>{item.name}<Button eventKey={null} onClick={(event) => { event.preventDefault();SettingsActions.remove(this.state.selectedType, index) }} bsStyle="link" bsSize="xsmall">X</Button></MenuItem>
				})}
				<MenuItem divider />
				<MenuItem onSelect={this.settingNew.bind(this)}>Нова настройка</MenuItem>
			</SplitButton>
			)
	}

	render() {
		
		return (
			<div>
			<Col md={12}>
				<MathComponent math={this.state.math} ref="math"/>

				<div>
					<div>
						<ButtonToolbar>
							<SplitButton  disabled={this.state.error} bsStyle='primary' onSelect={this.changeCor.bind(this)} onClick={this.submit.bind(this)} title={"Генерирай " + this.state.cor} id="dropdown-count">
								<MenuItem eventKey={1}>1</MenuItem>
								<MenuItem eventKey={5}>5</MenuItem>
								<MenuItem eventKey={10}>10</MenuItem>

							</SplitButton>

							<ToggleButton action={this.show.bind(this)} on="Скрий" off="Покажи">{'{0} отговорите'}</ToggleButton>
							{this.renderSettingsMenu()}
							

							{/*<ModalTrigger modal={<SettingsModal />}>
								
							</ModalTrigger>*/}


						</ButtonToolbar>
					</div>

					
					<RouteHandler 
						setting={this.state.selectedSetting} 
						onChange={this.subViewChanged.bind(this)} 
						key={this.context.router.getCurrentPath() + this.state.selectedSettingIndex} 
						validator={
							{
								charCheck: this.charCheck.bind(this),
								numberTransform: this.numberTransform.bind(this),
								stringCheck: this.stringCheck.bind(this)
							}} 
						check={checkStorageForDataOrReturnDefault}/>
				
				</div>	
				<Button onClick={this.print.bind(this)}>Принтирай</Button>	
				<PrintListComponent res={this.state.list}/>

			</Col>

			</div>
		);
	}
}

Generator.contextTypes = {
	router: React.PropTypes.func
};

class MathComponent extends React.Component
{
	constructor(props){
		super(props)
		this.state = {
			solution: "hidden"
		}
	}

	update(){
		this.shouldComponentUpdate = () => {
			this.shouldComponentUpdate = () => false;
			return true;
		};

	}

	componentWillReceiveProps(nextProps){
		this.update();
	}

	componentDidMount() {
		ReactDOM.findDOMNode(this.refs.problem).innerHTML = "За да създадете задача натиснете генерирай"
	}

	toggle(){
		this.update();
		
		if(this.state.solution == "hidden"){
			this.setState({solution: "visible"});
		}else{
			this.setState({solution: "hidden"});
		}
	} 

	render(){
		return (
			<Panel id="resCont">
				<Katex ref="problem" id="result" problem={this.props.math.problem}/>
				<Katex style={{visibility: this.state.solution}} problem={this.props.math.solution}/>
			</Panel>)
	}
}

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
			st.display = "block"


		}else{
			st.display = "none"
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
