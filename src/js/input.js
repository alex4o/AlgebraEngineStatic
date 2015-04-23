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

Pass: React.createClass({
    defaultProps:function(){

    },
    onChange: function(e){
    	this.props.value[this.props.bind] = e.target.value
    },
    render: function(){
        return(<input type="password" placeholder={this.props.placeholder} onChange={this.onChange}/>)
    }
}),

Md5: React.createClass({
    defaultProps:function(){

    },
    onChange: function(e){
    	this.props.value[this.props.bind] = md5(e.target.value)
    },
    render: function(){
        return(<input type="password" placeholder={this.props.placeholder} onChange={this.onChange}/>)
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

RadioWall: React.createClass({
	boxes:[],
	getInitialState: function(){
		for (var i = 0; i < this.props.count; i++) {

			this.boxes[i] = React.createElement(RadioInput,{update: this.onChange, group: this.props.bind, value: i})

		};
		console.log(this.boxes)

		return {}
	},
	onChange: function(e){
		this.props.value[this.props.bind] = this.props.values[e.target.value]
	},
	defaultProps:function(){

	},
	render: function(){
		lables = this.props.labels
		return(
			<div className="radioWall form">
				{this.boxes.map(function(self,index){return <div className="row"><label>{lables[index]}</label>{self}</div>})}
			</div>
			
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
}),

MinMax: React.createClass({

	getInitialState: function(){
		return {size: Math.abs(this.props.min)+Math.abs(this.props.max)}
	},
	onChange: function(e){


	},
	render: function(){
		return (
				<div className="row scol" rel="" >
					label:<input type="text" className="minInput"/><input type="text" className="maxInput"/>
				</div>
			

			)
	}
})

}