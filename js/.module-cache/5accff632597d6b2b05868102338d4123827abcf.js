/** @jsx React.DOM */
var StringInput = React.createClass({displayName: "StringInput",
    defaultProps:function(){

    },
    onChange: function(e){
        this.props.value[this.props.bind] = e.target.value
    },
    render: function(){
        return(React.createElement("input", {defaultValue: this.props.value[this.props.bind].toString(), type: "text", placeholder: this.props.placeholder, onChange: this.onChange}))
    }
});

var PassInput = React.createClass({displayName: "PassInput",
    defaultProps:function(){

    },
    onChange: function(e){
    	this.props.value[this.props.bind] = e.target.value
    },
    render: function(){
        return(React.createElement("input", {type: "password", placeholder: this.props.placeholder, onChange: this.onChange}))
    }
});

var Md5Input = React.createClass({displayName: "Md5Input",
    defaultProps:function(){

    },
    onChange: function(e){
    	this.props.value[this.props.bind] = md5(e.target.value)
    },
    render: function(){
        return(React.createElement("input", {type: "password", placeholder: this.props.placeholder, onChange: this.onChange}))
    }
});

var NumberInput = React.createClass({displayName: "NumberInput",
	defaultProps:function(){

	},
	onChange: function(e){

		this.props.value[this.props.bind] = e.target.value | 0
	},
	render: function(){
		return(
			React.createElement("input", {defaultValue: this.props.value[this.props.bind].toString(), type: "text", onChange: this.onChange})
		)
	}
});

var RadioInput = React.createClass({displayName: "RadioInput",
	defaultProps:function(){

	},
	onChange: function(e){
		
	},
	render: function(){
		console.log(this.props)

		return(
			React.createElement("input", {type: "radio", value: this.props.value, name: this.props.group, onChange: this.props.update})
		)
	}
});

var RadioWallInput = React.createClass({displayName: "RadioWallInput",
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
			React.createElement("div", {className: "radioWall form"}, 
				this.boxes.map(function(self,index){return React.createElement("div", {className: "row"}, React.createElement("label", null, lables[index]), self)})
			)
			
		)
	}
});

var RangeInput = React.createClass({displayName: "RangeInput",
	getInitialState: function(){
		return {size: Math.abs(this.props.min)+Math.abs(this.props.max)}
	},
	onChange: function(e){

		this.props.value[this.props.bind][1] = e.target.value | 0;
		this.props.value[this.props.bind][0] = this.props.max - e.target.value;


	},
	render: function(){
		return React.createElement("input", {type: "range", defaultValue: this.props.value[this.props.bind][1], min: this.props.min, max: this.props.max, width: "300", onChange: this.onChange})
	}
});

var MinMaxInput = React.createClass({displayName: "MinMaxInput",

	getInitialState: function(){
		return {size: Math.abs(this.props.min)+Math.abs(this.props.max)}
	},
	onChange: function(e){


	},
	render: function(){
		return (
				React.createElement("div", {className: "row scol", rel: ""}, 
					"label:", React.createElement("input", {type: "text", className: "minInput"}), React.createElement("input", {type: "text", className: "maxInput"})
				)
			

			)
	}
})