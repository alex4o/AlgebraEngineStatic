import React from 'react';

class katex extends React.Component
{
	componentDidMount(){

		//console.log(this.props.problem)

		var content = this.refs.content.getDOMNode()
		katex.render(this.props.problem,content)


	}

	componentDidUpdate(prevProps, prevState){
		//console.log(this.props.problem)

		var content = this.refs.content.getDOMNode()
		katex.render(this.props.problem,content)
	}

	render(){
		return(<span className="latex" ref="content"></span>)
	}
}

export default katex;