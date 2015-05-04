var React = require('react');

module.exports = {
String: React.createClass({
    defaultProps:function(){

    },
    onChange: function(e){
        this.props.value[this.props.bind] = e.target.value
    },
    render: function(){
        return(<input  defaultValue={this.props.value[this.props.bind].toString()} type="text" placeholder={this.props.placeholder} onChange={this.onChange}/>)
    }
}),

Number: React.createClass({
	defaultProps:function(){

	},
	onChange: function(e){

		this.props.value[this.props.bind] = e.target.value | 0
	},
	render: function(){
		return(
			<input defaultValue={this.props.value[this.props.bind].toString()} type="text" onChange={this.onChange}/>
		)
	}
}),

Radio: React.createClass({
	defaultProps:function(){

	},
	onChange: function(e){
		
	},
	render: function(){
		console.log(this.props)

		return(
			<input type="radio" value={this.props.value} name={this.props.group} onChange={this.props.update}/>
		)
	}
}),

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
})

}