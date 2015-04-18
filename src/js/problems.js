import React from 'react';
import http from 'superagent';
import Katex from "./katex";


export default class Problems extends React.Component
{
	constructor(props)
	{
		
		super(props);
		this.state = {
		  list: [],
		  starlist: []
		};
	}

	componentDidMount() 
	{
		self = this;
  		http.get("/api/data/problems/").query({token: sessionStorage.getItem("token")}).end(this.update.bind(this));
	}

	update(err,res)
	{
		this.setState({
			list: JSON.parse(res.text)
		});
	}

	render()
	{

		let ListItems = this.state.list.map(function(item,index){
			return (<ProblemListItem latex={item.t1}/>)
		})
		return (
		
		<div>
			<h1>Генерирани задачи</h1>
			<div className="gen-list">
				{ListItems}
			</div>
		</div>
		);
	}
}

class ProblemListItem extends React.Component
{
    render() {
        return (
            <div className="gen-item">
				<Katex problem={this.props.latex}/>
				{/*<span className="control">Любима</span>
				<span className="control">Изтрий</span>*/}
			</div>
        );
    }
}

