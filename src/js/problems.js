import React from 'react';
import http from 'superagent';
import katex from "./katex";


module.exports = React.createClass({
	getInitialState: function() {
		return {
		  list: [],
		  starlist: []
		};
	},
	componentDidMount: function () {
		self = this;
  		http.get("/api/data/problems/").query({token: sessionStorage.getItem("token")}).end(this.update)
	},
	update: function(res){
		this.setState({
			list: JSON.parse(res.text)
		});
	},
	render: function() {

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
});

var ProblemListItem = React.createClass({
    render: function () {
        return (
            <div className="gen-item">
				<katex problem={this.props.latex}/>
				{/*<span className="control">Любима</span>
				<span className="control">Изтрий</span>*/}
			</div>
        );
    }
});

