import React from 'react';
import http from 'superagent';
import Katex from "./katex";
import UserStore from "./stores/user"
import UserActions from "./actions/user"


import katex from 'katex';

export default class Problems extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
		  list: [],
		  fullyloaded: false,
		  starlist: []
		};

		this.listen = (data) => {
			let state = UserStore.getState();
			this.setState(state.data)
			http.get("/api/data/problems/").query({token: state.token}).end(this.update.bind(this));
		}.bind(this);
	}

	componentDidMount() {
		self = this;	
		UserStore.listen(this.listen)
		UserActions.checkLogIn();


	}

	componentWillUnmount() {
		UserStore.unlisten(this.listen)
	}

	update(err,res)	{
		let out = JSON.parse(res.text);

		this.setState({
			list: (out == undefined) ? [] : out 
		});
	}

	render(){
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
	constructor(props)
	{
		
		super(props);
		this.state = {
			loaded: 0
		};
	}

	componentDidMount(){
		this.scrollb = this.scroll.bind(this); //binded scrol function
		window.addEventListener("scroll", this.scrollb);
		this.offset = React.findDOMNode(this.refs.list).getBoundingClientRect().top;
		console.log(this.refs)


		//this.scrollb();
	}

	componentWillReceiveProps(nextProps){
	
	}

	componentDidUpdate(nextProps, nextState){
		if(this.refs[0] == null) return;
		for(let i = 0; i <= 25; i++){
			this.refs[i].show();
		}
	}

	scroll(one){
		var offset =  window.scrollY - (this.offset);
		var offset = offset < 0 ? 0 : offset;
		var offsetEnd = offset + window.innerHeight;
		let start = Math.ceil(offset/50);
		let end = Math.ceil(offsetEnd/50);


		for(let i = start; i <= end; i++){
			this.refs[i].show();
		}
		//console.log(offset/50)
	}

	componentWillUnmount() {
		console.log("Problems unmouned")
		window.removeEventListener("scroll",this.scrollb)
	}

	render(){
		return(
			<div ref="list" style={{height: this.props.list.length*50}} className="gen-list">
				{this.props.list.map((item,index) => {
					return <ProblemListItem key={index} ref={index} latex={item.t1}/>
				})}
			</div>
		)
	}
}

class ProblemListItem extends React.Component
{
	constructor(props){
		super(props)
		//this.state = {content: <div></div>};
		this.show = this.exec;
	}

	exec() {
		this.setState({__html: katex.renderToString(this.props.latex)});
		this.show = () => {};
	}

	componentWillReceiveProps(nextProps){
		this.show = this.exec;
	}

    render() {
 		let controls = <div></div>
 		if(this.props.controls){
 			controls = (
 				<div>
 					<span className="control">Любима</span>
					<span className="control">Изтрий</span>
				</div>
			)
 		}   

        return (
            <div className="gen-item">
            	<span dangerouslySetInnerHTML={this.state}></span>
            	
				{controls}
			</div>
        );
    }
}

