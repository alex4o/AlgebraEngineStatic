var InputView = React.createClass({
	componentDidMount: function() {
		katex.render(this.props.math,this.refs.equ.getDOMNode())
	},
	render: function(){
		return(React.createElement("div",{},React.createElement(NumberInput,null)))
	}
})