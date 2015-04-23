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
		http.get("/api/data/problems/").query({token: JSON.parse(sessionStorage.getItem("token")).token}).end(this.update.bind(this));
	}

	update(err,res)
	{
		let out = JSON.parse(res.text);

		this.setState({
			list: (out == undefined) ? out : [] 
		});
	}

	render()
	{


		return (
		
		<div>
			<h1>Генерирани задачи</h1>
			<ProblemList list={this.state.list}/>
		</div>
		);
	}
}

class ProblemList extends React.Component
{
	componentDidMount(){
		this.scrollb = this.scroll.bind(this); //binded scrol function
		window.addEventListener("scroll", this.scrollb);
		this.setState({offset: this.refs.list.getDOMNode().offsetTop});
	}

	scroll(one){
		var offset = scrollY - this.state.offset;
		if(offset < 0){
			offset = 0;
		}
		console.log(offset/50)
	}

	componentWillUnmount() {
		window.removeEventListener("scroll",this.scrollb)
	}

	render(){

		let ListItems = this.props.list.map(function(item,index){
			return (<ProblemListItem height="49px" latex={item.t1}/>)
		})

		return(
			<div ref="list" style={{height: this.props.list.length*50}} className="gen-list">
				{ListItems}
			</div>
		)

	}
}

class ProblemListItem extends React.Component
{
    render() {
        return (
            <div className="gen-item" style={{lineHeight:this.props.height}}>
				<Katex problem={this.props.latex}/>
				{/*<span className="control">Любима</span>
				<span className="control">Изтрий</span>*/}
			</div>
        );
    }
}

