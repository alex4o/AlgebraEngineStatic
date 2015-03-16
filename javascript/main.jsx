
/*
var data = {
	fraction    : 50,
	natural		: 50,
	irrational	: 0,
	up	: {low:1 ,high:10},
	down: {low:1 ,high:10}
}
*/
var model = {
	data: {

	},
	addres: "",
	user: {
		name: "",
		pass: ""
	},
	res :{

	}
}

function checkStorageForDataOrReturnDefault(def){
	if(localStorage[model.addres] != null && localStorage[model.addres] != ""){
		return JSON.parse(localStorage[model.addres]);
	}else{
		return def
	}
}

/** @jsx React.DOM */
var MathComponent = React.createClass({
	componentDidUpdate:function(prevProps, prevState){

		var problem = this.refs.problem.getDOMNode()
		var solution = this.refs.solution.getDOMNode()
		katex.render(this.props.math[0].problem,problem)
		katex.render(this.props.math[0].solution,solution)
		
	},
	componentDidMount: function() {
		this.refs.problem.getDOMNode().innerHTML = "За да създадете задача натиснете генерирай"
	},
	render: function(){
		return (
			<div id="MathContainer">
				<span id="result" ref="problem"></span>
				<span style={{display:this.props.solutionVisable ? "block" : "none"}} ref="solution"></span>
			</div>)
	}
})


var InputComponent = React.createClass({
	views: [QuadraticEquation,EquivalentExpressions,Equation],
	getInitialState: function(){
		return {view: "div"}
	},
	componentDidMount: function(){
		console.log(this.views)
		routie('problems/type/:id', this.changeView);
	},
	changeView: function(id){
		if(id < this.views.length){
			this.setState({view: this.views[id]})
		}
	},
	render: function () {
		var data = this.props.model.data
		return (React.createElement(this.state.view,{model:model}));
	}
});

var KaТeXitem = React.createClass({
	componentDidMount:  function(){

		//console.log(this.props.problem)

		var shit = this.refs.shit.getDOMNode()
		katex.render(this.props.problem,shit)


	},
	componentDidUpdate: function(prevProps, prevState){
		//console.log(this.props.problem)

		var shit = this.refs.shit.getDOMNode()
		katex.render(this.props.problem,shit)
	},
	render: function(){
		return(<span  ref="shit"></span>)
	}
})

var ProblemListComonent = React.createClass({
	render: function () {
		problems = this.props.res.map(function(result,iter){
			//console.log(result)
			return (<div className="items"><span className="num">{iter+1}</span><KaТeXitem problem={result.problem} /></div>)
		})

		return (

			<div id="anchor" className="list">
				Задачи:
				{problems}
			</div>
		)
	}
});

var SolutionListComonent = React.createClass({
	render: function () {
		problems = this.props.res.map(function(result,iter){
			//console.log(result)
			return (<div className="items"><span className="num">{iter+1}</span><KaТeXitem problem={result.solution} /></div>)
		})

		return (

			<div className="list">
				Отговори:
				{problems}
			</div>
		)
	}
});

var App = React.createClass({
	getInitialState: function(){
		return {
			math: [{problem: "", solution: ""}],
			sv: false,
			list: []
		}
	},
	submit: function(){
		self = this
		localStorage[model.addres] = JSON.stringify(model.data)
		superagent.post("/api" + model.addres).send(model.data).send({cor:1}).end(function(res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				self.setState({math: model.res})

			}else{
				self.setState({math: {problem: "error",solution:" --- "} })

				//katex.render("error",problem)


			}
		});
		//alert(math)
		//console.log(math)
		
		//this.setState({math: math})
	},
	submit_more: function(){
		self = this
		localStorage[model.addres] = JSON.stringify(model.data)
		ofset = document.getElementById("anchor").offsetTop;
		
		superagent.post("/api" + model.addres).send(model.data).send({cor:10}).end(function(res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				console.log(model.res)

				self.setState({list: model.res})
				console.log(ofset)
				scrollTo(0,ofset)

			}else{
				//katex.render("error",problem)


			}
		});


		//alert(math)
		//console.log(math)
	},
	show: function(){
		this.setState({sv: !this.state.sv});
	},
	render: function () {
		return (
			<div>

			<MathComponent math={this.state.math} solutionVisable={this.state.sv}/>
				<div id="sidebar">

					<div className="item">
						<span>7 клас</span>
						<div>
							<a href="#problems/type/1">Tъждествени изрази</a>
							<a href="#problems/type/2">Уравнения</a>




						</div>
					</div>
			</div>

			<div id="inner-content" >
				
				<div id="app">

				<input type="button" className="myButton" value="Генерирай" onClick={this.submit}/>
				<input type="button" className="myButton" value="Генерирай 10" onClick={this.submit_more}/>
				<input type="button" className="myButton" value="Покажи/скрий отговор" onClick={this.show}/>

				<div id="InputContainer">
					<InputComponent model={model}/>
				</div>

				<ProblemListComonent res={this.state.list}/>
				<SolutionListComonent res={this.state.list}/>



				</div>
			</div>

				

				
			</div>
		);
	}
});

React.render(<App/>,document.getElementById("content"))
React.render(<UserForm data={model.user}/>,document.getElementById("user"))


