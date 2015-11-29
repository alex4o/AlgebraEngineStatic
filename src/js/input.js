import React from 'react';
import {Input,DropdownButton,MenuItem,Col} from 'react-bootstrap';


class StringInput extends React.Component{
	onChange(e){
		this.props.value[this.props.bind] = e.target.value
	}

	render(){
		return(<Input 
			defaultValue={this.props.value[this.props.bind].toString()} 
			type="text" label={this.props.label} 
			placeholder={this.props.placeholder} 
			onChange={this.onChange.bind(this)}/>)
	}
}

class CustomTextInput extends React.Component
{

	constructor(props){
		super(props)
		this.state = {
			valid: ""
		}
	}

	onChange(e){
		this.props.transform(e.target.value,(out) => {
			this.props.value[this.props.bind] = out;
			this.setState({valid: "success"})

		},() => {
			this.setState({valid: "error"})
		});
	}

	render(){
		return(<Input
		 defaultValue={this.props.value[this.props.bind].toString()} 
		 type="text" 
		 onChange={this.onChange.bind(this)}
		 placeholder={this.props.placeholder}
		 bsStyle={this.state.valid}
		 label={this.props.label}/>)
		
	}
}

class DropDown extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			title: props.options.reduce((last, now) => props.default == now.key ? now.value:last,null)
		}
	}

	select(key){
		this.props.value[this.props.bind] = key
		this.setState({title:this.props.options.reduce((last, now) => key == now.key ? now.value:last,null)})
	}

	render(){
		return(
			<DropdownButton title={this.state.title} onSelect={this.select.bind(this)}>
				{this.props.options.map((item, index) => <MenuItem eventKey={item.key}>{item.value}</MenuItem>)}
			</DropdownButton>)
	}
}

class CheckBox extends React.Component{
	select(e){
		console.log(e.target.checked)
		this.props.value[this.props.bind] = e.target.checked
	}

	render(){
		return(<Input 
			defaultValue={this.props.value[this.props.bind]}  
			type='checkbox' 
			label={this.props.label}
			onChange={this.select.bind(this)} />)
	}
}

class RadioList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			checked: props.value[props.bind]
		}
	}

	select(val){
		this.props.value[this.props.bind] = val;
		this.setState({checked: val});
	}

	render(){
		return(<div>
			{this.props.options.map((item, index) => <Col sm={12/this.props.options.length} key={index}><Input 
				type="radio" 
				label={item.value} 
				checked={item.key == this.state.checked} 
				
				onChange={this.select.bind(this,item.key)}
				name={this.props.bind} 
			/></Col>)}
		</div>)
	}
}


module.exports = {
String: StringInput,
CustomText: CustomTextInput,

Range: React.createClass({
	getInitialState: function(){
		return {size: Math.abs(this.props.min)+Math.abs(this.props.max)}
	},
	onChange: function(e){
		console.log(e.target.value)
		this.props.value[this.props.bind][1] = e.target.value | 0;
		this.props.value[this.props.bind][0] = this.props.max - e.target.value;


	},
	render: function(){
		return <input type="range" defaultValue={this.props.value[this.props.bind][1]} min={this.props.min} max={this.props.max} width="300" onChange={this.onChange}/>
	}
}),
DropDown: DropDown,
CheckBox: CheckBox,
RadioList: RadioList
}