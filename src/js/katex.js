import React from 'react';
import katex from 'katex';

class Katex extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	componentDidMount(){
		//console.log(this.props.problem)
	}

	componentDidUpdate(prevProps, prevState){

	}

	render(){
		return(<span className="latex" ref="content" dangerouslySetInnerHTML={{__html: katex.renderToString(this.props.problem)}}></span>)
	}
}

export default Katex;