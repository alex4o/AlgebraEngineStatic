/** @jsx React.DOM */

var React = require('react');
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RouteHandler = Router.RouteHandler;
var UserForm = require("./user.js")
var Problems = require("./problems.js")
var EquivalentExpressions = require("./view/EquivalentExpressions.js")
var Equation = require("./view/Equation.js")

console.log(UserForm)

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

if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}

function checkStorageForDataOrReturnDefault(def){
	if(localStorage[model.addres] != null && localStorage[model.addres] != ""){
		return JSON.parse(localStorage[model.addres]);
	}else{
		return def
	}
}

var MathComponent = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.math !== this.props.math || nextProps.solutionVisable !== this.props.solutionVisable;
	},
	componentDidUpdate:function(prevProps, prevState){

		var problem = this.refs.problem.getDOMNode()
		var solution = this.refs.solution.getDOMNode()
		if(this.props.math !== prevProps.math){
			katex.render(this.props.math[0].solution,solution)
			katex.render(this.props.math[0].problem,problem)
		}
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
		return(<span className="latex" ref="shit"></span>)
	}
})

var PrintListComponent = React.createClass({
	componentDidUpdate: function(){
		ofset = document.getElementById("anchor").offsetTop;
		scrollTo(0,ofset)
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.res !== this.props.res;
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
				{solution}
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

			<div id="inner-content" >
				
				<div>
					<div className="menu">
						<div className="menu-item" onClick={this.submit}>Генерирай</div>
						<div className="menu-item" onClick={this.submit_more}>Генерирай няколко</div>
						<Togglemenuitem action={this.show} on="Скрий" off="Покажи">{'{0} отговорите'}</Togglemenuitem>
					</div>
					
					<div id="InputContainer">
						<RouteHandler model={model}/>
					</div>


				</div>

				

			</div>
			
			<PrintListComponent res={this.state.list}/>
			</div>

		);
	}
});

var Togglemenuitem = React.createClass({
	getInitialState: function() {
		return {
			activated: false	
		};
	},
	call: function(activated) {
		this.props.action(this.state.activated)
		this.setState({activated: !this.state.activated})
		console.log()
	},

	render: function() {
		return <div className="menu-item" onClick={this.call}>{this.props.children.format(this.state.activated ? this.props.on : this.props.off)}</div>;
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
		document.addEventListener("click", this.hide);
	},

	hide: function() {
		document.removeEventListener("click", this.hide);
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

var Home = React.createClass({
	render: function(){
		return (<div>
				<h1>Начало</h1>
				<p>Създадохме сайт за генериране на задача, с цел улеснението на нашите учители. Сайта също е подходящ за ученици търсещи нови усещания в математиката.</p>
			</div>)
	}
})

var App = React.createClass({
	getInitialState: function(){
		return {
			page: 0,
		}
	},
	openMenu: function(){
		this.refs.menu.show()
	},
	componentDidMount: function(){
		self = this
	},
	render: function () {
		return (<div>

		<nav>
			<div id="select">
				<div className="logo" onClick={this.openMenu}>
					Математика за всички
				</div>
				<div id="user" style={{float:"right"}}>
					<UserForm data={model.user}/>
				</div>
			</div>

		</nav>


		<div id="content">
				<Menu ref="menu">
						<MenuItem hash="#/">Начало</MenuItem>

						<MenuItem hash="#/Problem/EquivalentExpressions">Tъждествени изрази</MenuItem>
						<MenuItem hash="#/Problem/Equation">Уравнения</MenuItem>
						

					</Menu>
					<RouteHandler/>
		</div>
				
			

		</div>


		);
	}
});


var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} />
    <Route name="" path="/Problems" handler={Problems} />

    <Route name="problems" handler={Generator}>
      <Route name="" path="/Problem/Equation" handler={Equation} />
      <Route name="" path="/Problem/EquivalentExpressions" handler={EquivalentExpressions} />
    </Route>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

//React.render(<App/>,document.body)

