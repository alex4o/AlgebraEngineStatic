
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
var MathComponent = React.createClass({displayName: "MathComponent",
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
			React.createElement("div", {id: "MathContainer"}, 
				React.createElement("span", {id: "result", ref: "problem"}), 
				React.createElement("span", {style: {display:this.props.solutionVisable ? "block" : "none"}, ref: "solution"})
			))
	}
})


var InputComponent = React.createClass({displayName: "InputComponent",
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

var KaТeXitem = React.createClass({displayName: "KaТeXitem",
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
		return(React.createElement("span", {ref: "shit"}))
	}
})

var PrintListComponent = React.createClass({displayName: "PrintListComponent",
	render: function () {
		problems = this.props.res.map(function(result,iter){
			//console.log(result)
			return (React.createElement("div", {className: "items"}, React.createElement("span", {className: "num"}, iter+1), React.createElement(KaТeXitem, {problem: result.problem})))
		})

		solution = this.props.res.map(function(result,iter){
			//console.log(result)
			return (React.createElement("div", {className: "items"}, React.createElement("span", {className: "num"}, iter+1), React.createElement(KaТeXitem, {problem: result.solution})))
		})

		return (

			React.createElement("div", {id: "anchor", className: "list"}, 
				"Задачи:", 
				problems, 
				React.createElement("br", null), 
				"Отговори:", 
				problems
			)
		)
	}
});


var MenuList = React.createClass({displayName: "MenuList",
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
			return React.createElement("a", {className: style, href: item.href, onClick: self.change.bind(self,index)}, item.text)
		})
		return (React.createElement("div", null, list))
	}
}) 

var ViewChanger = React.createClass({displayName: "ViewChanger",

	render: function () {
		console.log(this.props)
		if(this.props.id < this.props.views.length){
			return (React.createElement(this.props.views[this.props.id],{model:model}));
		}else{
			return React.createElement("div", null)
		}
	}
});


var Generator = React.createClass({displayName: "Generator",
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
			React.createElement("div", null, 

			React.createElement(MathComponent, {math: this.state.math, solutionVisable: this.state.sv}), 

			React.createElement("div", {id: "sidebar"}, 
					React.createElement("div", {className: "item"}, 
						React.createElement("span", null, "7 клас"), 
						React.createElement(MenuList, {items: [
							{href: "#problems/type/0", text:"Tъждествени изрази"},
							{href: "#problems/type/1", text:"Уравнения"}
							]})
					)
			), 

			React.createElement("div", {id: "inner-content"}, 
				
				React.createElement("div", null, 
					React.createElement("div", {className: "menu"}, 
						React.createElement("div", {className: "menu-item", onClick: this.submit}, "Генерирай"), 
						React.createElement("div", {className: "menu-item", onClick: this.submit_more}, "Генерирай няколко"), 
						React.createElement("div", {className: "menu-item", onClick: this.show}, "Покажи/скрий отговорите")
					), 
					
					React.createElement("div", {id: "InputContainer"}, 
						React.createElement(InputComponent, {model: model})
					), 

					React.createElement(PrintListComponent, {res: this.state.list})

				)
			)

			)

		);
	}
});

var Menu = React.createClass({displayName: "Menu",
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
		React.createElement("div", {className: ""}, 
			React.createElement("div", {className: "slide-menu-"+(this.state.visible ? "visible " : "")+ " slide-menu"}, 
				this.props.children
			)
		));
	}
});

var MenuItem = React.createClass({displayName: "MenuItem",
	navigate: function(hash) {
		window.location.hash = hash;
	},

	render: function() {
		return React.createElement("div", {className: "slide-menu-item", onClick: this.navigate.bind(this, this.props.hash)}, this.props.children);
	}
});

var App = React.createClass({displayName: "App",
	getInitialState: function(){
		return {
			page: 0
		}
	},
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement(Menu, null, 
					React.createElement(MenuItem, {hash: "#WTF"}, "Hello"), 
					React.createElement(MenuItem, {hash: "#WTF1"}, "NoWay"), 
					React.createElement(MenuItem, {hash: "#WTF2"}, "Shit")

				), 
				React.createElement(ViewChanger, {views: [Generator], id: this.state.page})

			)
		);
	}
});

React.render(React.createElement(App, null),document.getElementById("content"))
React.render(React.createElement(UserForm, {data: model.user}),document.getElementById("user"))


