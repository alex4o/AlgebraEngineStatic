
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

/** @jsx React.DOM */
var MathComponent = React.createClass({displayName: "MathComponent",
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
			React.createElement("div", {id: "MathContainer"}, 
				React.createElement("span", {id: "result", ref: "problem"}), 
				React.createElement("span", {style: {display:this.props.solutionVisable ? "block" : "none"}, ref: "solution"})
			))
	}
})

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
			return (React.createElement("div", {className: "items"}, React.createElement("span", {className: "num"}, iter+1), React.createElement(KaТeXitem, {problem: result.problem})))
		})

		solution = this.props.res.map(function(result,iter){
			//console.log(result)
			return (React.createElement("div", {className: "items"}, React.createElement("span", {className: "num"}, iter+1), React.createElement(KaТeXitem, {problem: result.solution})))
		})
		var st = {}
		if(this.props.res.length > 0){
			st["display"] = "block"


		}else{
			st["display"] = "none"
		}

		return (

			React.createElement("div", {id: "anchor", style: st, className: "list"}, 
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
			React.createElement("div", null, 

			React.createElement(MathComponent, {math: this.state.math, solutionVisable: this.state.sv}), 

			React.createElement("div", {id: "inner-content"}, 
				
				React.createElement("div", null, 
					React.createElement("div", {className: "menu"}, 
						React.createElement("div", {className: "menu-item", onClick: this.submit}, "Генерирай"), 
						React.createElement("div", {className: "menu-item", onClick: this.submit_more}, "Генерирай няколко"), 
						React.createElement(Togglemenuitem, {action: this.show, on: "Скрий", off: "Покажи"}, '{0} отговорите')
					), 
					
					React.createElement("div", {id: "InputContainer"}, 
						React.createElement(ReactRouter.RouteHandler, {model: model})
					)


				)

				

			), 
			
			React.createElement(PrintListComponent, {res: this.state.list})
			)

		);
	}
});

var Togglemenuitem = React.createClass({displayName: "Togglemenuitem",
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
		return React.createElement("div", {className: "menu-item", onClick: this.call}, this.props.children.format(this.state.activated ? this.props.on : this.props.off));
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
		document.addEventListener("click", this.hide);
	},

	hide: function() {
		document.removeEventListener("click", this.hide);
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

var Home = React.createClass({displayName: "Home",
	render: function(){
		return (React.createElement("div", null, 
				React.createElement("h1", null, "Начало"), 
				React.createElement("p", null, "Създадохме сайт за генериране на задача, с цел улеснението на нашите учители. Сайта също е подходящ за ученици търсещи нови усещания в математиката.")
			))
	}
})

var App = React.createClass({displayName: "App",
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
		routie(":id",function(id){
			console.log(id)
			self.setState({page: id | 0})
		});

	},
	render: function () {
		return (React.createElement("div", null, 

		React.createElement("nav", null, 
			React.createElement("div", {id: "select"}, 
				React.createElement("logo", {onClick: this.openMenu}, 
					"Математика за всички"
				), 
				React.createElement("div", {id: "user", style: {float:"right"}}, 
					React.createElement(UserForm, {data: model.user})
				)
			)

		), 


		React.createElement("div", {id: "content"}, 
				React.createElement(Menu, {ref: "menu"}, 
						React.createElement(MenuItem, {hash: "#/"}, "Начало"), 

						React.createElement(MenuItem, {hash: "#/Problem/EquivalentExpressions"}, "Tъждествени изрази"), 
						React.createElement(MenuItem, {hash: "#/Problem/Equation"}, "Уравнения")
						

					), 
					React.createElement(ReactRouter.RouteHandler, null)
		)
				
			

		)


		);
	}
});
ReactRouter

var routes = (
  React.createElement(ReactRouter.Route, {handler: App, path: "/"}, 
    React.createElement(ReactRouter.DefaultRoute, {handler: Home}), 
    React.createElement(ReactRouter.Route, {name: "problems", handler: Generator}, 
      React.createElement(ReactRouter.Route, {name: "", path: "/Problem/Equation", handler: Equation}), 
      React.createElement(ReactRouter.Route, {name: "", path: "/Problem/EquivalentExpressions", handler: EquivalentExpressions})
    )
  )
);

ReactRouter.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.body);
});

//React.render(<App/>,document.body)
