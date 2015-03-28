
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
	view_id: 0,
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
	views: [EquivalentExpressions,Equation,QuadraticEquation],
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
			model.view_id = id | 0;
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

var PrintListComponent = React.createClass({
	componentDidUpdate: function(){
		ofset = document.getElementById("anchor").offsetTop;
		scrollTo(0,ofset)
	},
	render: function () {
		problems = this.props.res.map(function(result,iter){
			//console.log(result)
			return (<div className="items"><span className="num">{iter+1}</span><KaТeXitem problem={result.problem} /></div>)
		})

		solution = this.props.res.map(function(result,iter){
			//console.log(result)
			return (<div className="items"><span className="num">{iter+1}</span><KaТeXitem problem={result.solution} /></div>)
		})
		var st = {}
		if(this.props.res.length > 0){
			st["display"] = "block"


		}else{
			st["display"] = "none"
		}

		return (

			<div id="anchor" style={st} className="list">
				Задачи:
				{problems}
				<br />
				Отговори:
				{problems}
			</div>
		)
	}
});


var MenuList = React.createClass({
	getInitialState: function () {
		return {
			selected: model.view_id
		};
	},
	change: function(index){
		console.log(index)
		this.setState({selected: index})
	},
	render: function(){
		var self = this;
		var list = this.props.items.map(function(item,index){
			var style = ""
			if(self.state.selected == index){
				style = "selected"
			}
			return <a className={style} href={item.href} onClick={self.change.bind(self,index)}>{item.text}</a>
		})
		return (<div>{list}</div>)
	}
}) 

var ViewChanger = React.createClass({

	render: function () {
		console.log(this.props)
		if(this.props.id < this.props.views.length){
			return (React.createElement(this.props.views[this.props.id],{model:model}));
		}else{
			return <div></div>
		}
	}
});


var Generator = React.createClass({
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
		
		
		superagent.post("/api" + model.addres).send(model.data).send({cor:10}).end(function(res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				console.log(model.res)

				self.setState({list: model.res})
				console.log(ofset)

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
						<MenuList items={[
							{href: "#problems/type/0", text:"Tъждествени изрази"},
							{href: "#problems/type/1", text:"Уравнения"}
							]} />
					</div>
			</div>

			<div id="inner-content" >
				
				<div>
					<div className="menu">
						<div className="menu-item" onClick={this.submit}>Генерирай</div>
						<div className="menu-item" onClick={this.submit_more}>Генерирай няколко</div>
						<div className="menu-item" onClick={this.show}>Покажи/скрий отговорите</div>
					</div>
					
					<div id="InputContainer">
						<InputComponent model={model}/>
					</div>


				</div>

				

			</div>
			<PrintListComponent res={this.state.list}/>
			</div>

		);
	}
});

var Menu = React.createClass({
	getInitialState: function() {
		return {
			visible: false	
		};
	},

	show: function() {
		this.setState({ visible: true });
		document.addEventListener("click", this.hide.bind(this));
	},

	hide: function() {
		document.removeEventListener("click", this.hide.bind(this));
		this.setState({ visible: false });
	},

	render: function() {
		return (
		<div className="">
			<div className={"slide-menu-"+(this.state.visible ? "visible " : "")+ " slide-menu"}>
				{this.props.children}
			</div>
		</div>);
	}
});

var MenuItem = React.createClass({
	navigate: function(hash) {
		window.location.hash = hash;
	},

	render: function() {
		return <div className="slide-menu-item" onClick={this.navigate.bind(this, this.props.hash)}>{this.props.children}</div>;
	}
});

var App = React.createClass({
	getInitialState: function(){
		return {
			page: 0
		}
	},
	render: function () {
		return (
			<div>
				<Menu>
					<MenuItem hash="#WTF">Hello</MenuItem>
					<MenuItem hash="#WTF1">NoWay</MenuItem>
					<MenuItem hash="#WTF2">Shit</MenuItem>

				</Menu>
				<ViewChanger views={[Generator]} id={this.state.page} />

			</div>
		);
	}
});

React.render(<App/>,document.getElementById("content"))
React.render(<UserForm data={model.user}/>,document.getElementById("user"))


