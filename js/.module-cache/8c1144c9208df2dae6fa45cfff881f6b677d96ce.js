
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
		routie('0/type/:id', this.changeView);
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
	componentDidUpdate: function(){
		ofset = document.getElementById("anchor").offsetTop;
		scrollTo(0,ofset)
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.res[0] !== this.props.res[0];
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
						React.createElement("div", {className: "menu-item", onClick: this.show}, "Покажи/скрий отговорите")
					), 
					
					React.createElement("div", {id: "InputContainer"}, 
						React.createElement(InputComponent, {model: model})
					)


				)

				

			), 
			
			React.createElement(PrintListComponent, {res: this.state.list})
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
			page: 0,
		}
	},
	openMenu: function(){
		this.refs.menu.show()
	},
	componentDidMount: function(){
		self = this
		routie(":id",function(id){
			self.setState({page: id | 0})
		});

	},
	render: function () {
		return (React.createElement("div", null, 

		React.createElement("nav", null, 
			React.createElement("div", {id: "select"}, 
				React.createElement("button", {onClick: this.openMenu}, "show"), 
				React.createElement("logo", null, 
					"Математика за всички"
				), 
				React.createElement("div", {id: "user", style: {float:"right"}}, 
					React.createElement(UserForm, {data: model.user})
				)
			)

		), 


		React.createElement("div", {id: "content"}, 
				React.createElement(Menu, {ref: "menu"}, 
						React.createElement(MenuItem, {hash: "#0/0"}, "Tъждествени изрази"), 
						React.createElement(MenuItem, {hash: "#0/1"}, "Уравнения"), 
						React.createElement(MenuItem, {hash: "#0/2"}, "WTF")

					), 
					React.createElement(ViewChanger, {views: [Generator], id: this.state.page})
		)
				
			

		)


		);
	}
});

React.render(React.createElement(App, null),document.body)


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZWQuanMiLCJzb3VyY2VzIjpbbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUU7QUFDRixJQUFJLEtBQUssR0FBRztDQUNYLE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQyxJQUFJLEVBQUU7O0VBRUw7Q0FDRCxNQUFNLEVBQUUsRUFBRTtDQUNWLElBQUksRUFBRTtFQUNMLElBQUksRUFBRSxFQUFFO0VBQ1IsSUFBSSxFQUFFLEVBQUU7RUFDUjtBQUNGLENBQUMsR0FBRyxFQUFFOztFQUVKO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLGtDQUFrQyxDQUFDLEdBQUcsQ0FBQztDQUMvQyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ3pFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDOUMsSUFBSTtFQUNKLE9BQU8sR0FBRztFQUNWO0FBQ0YsQ0FBQzs7QUFFRCxxQkFBcUI7QUFDckIsSUFBSSxtQ0FBbUMsNkJBQUE7QUFDdkMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLFNBQVMsRUFBRSxTQUFTLENBQUM7O0VBRWhELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtFQUM1QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7RUFDOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ2xELEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFD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aEIsb0JBQUMsSUFBSSxFQUFBLENBQUEsQ0FBQyxHQUFBLEVBQUcsQ0FBQyxNQUFPLENBQUEsRUFBQTtNQUNmLG9CQUFDLFFBQVEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBTyxDQUFBLEVBQUEsb0JBQTZCLENBQUEsRUFBQTtNQUNuRCxvQkFBQyxRQUFRLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQU8sQ0FBQSxFQUFBLFdBQW9CLENBQUEsRUFBQTtBQUNoRCxNQUFNLG9CQUFDLFFBQVEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBTyxDQUFBLEVBQUEsS0FBYyxDQUFBOztLQUU5QixDQUFBLEVBQUE7S0FDUCxvQkFBQyxXQUFXLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFFLENBQUMsU0FBUyxDQUFDLEVBQUMsQ0FBQyxFQUFBLEVBQUUsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQSxDQUFHLENBQUE7QUFDN0QsRUFBUSxDQUFBO0FBQ1I7QUFDQTs7QUFFQSxFQUFRLENBQUE7QUFDUjs7SUFFSTtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxHQUFHLEVBQUEsSUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLypcbnZhciBkYXRhID0ge1xuXHRmcmFjdGlvbiAgICA6IDUwLFxuXHRuYXR1cmFsXHRcdDogNTAsXG5cdGlycmF0aW9uYWxcdDogMCxcblx0dXBcdDoge2xvdzoxICxoaWdoOjEwfSxcblx0ZG93bjoge2xvdzoxICxoaWdoOjEwfVxufVxuKi9cbnZhciBtb2RlbCA9IHtcblx0dmlld19pZDogMCxcblx0ZGF0YToge1xuXG5cdH0sXG5cdGFkZHJlczogXCJcIixcblx0dXNlcjoge1xuXHRcdG5hbWU6IFwiXCIsXG5cdFx0cGFzczogXCJcIlxuXHR9LFxuXHRyZXMgOntcblxuXHR9XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RvcmFnZUZvckRhdGFPclJldHVybkRlZmF1bHQoZGVmKXtcblx0aWYobG9jYWxTdG9yYWdlW21vZGVsLmFkZHJlc10gIT0gbnVsbCAmJiBsb2NhbFN0b3JhZ2VbbW9kZWwuYWRkcmVzXSAhPSBcIlwiKXtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbW9kZWwuYWRkcmVzXSk7XG5cdH1lbHNle1xuXHRcdHJldHVybiBkZWZcblx0fVxufVxuXG4vKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBNYXRoQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRjb21wb25lbnREaWRVcGRhdGU6ZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpe1xuXG5cdFx0dmFyIHByb2JsZW0gPSB0aGlzLnJlZnMucHJvYmxlbS5nZXRET01Ob2RlKClcblx0XHR2YXIgc29sdXRpb24gPSB0aGlzLnJlZnMuc29sdXRpb24uZ2V0RE9NTm9kZSgpXG5cdFx0a2F0ZXgucmVuZGVyKHRoaXMucHJvcHMubWF0aFswXS5wcm9ibGVtLHByb2JsZW0pXG5cdFx0a2F0ZXgucmVuZGVyKHRoaXMucHJvcHMubWF0aFswXS5zb2x1dGlvbixzb2x1dGlvbilcblx0XHRcblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVmcy5wcm9ibGVtLmdldERPTU5vZGUoKS5pbm5lckhUTUwgPSBcItCX0LAg0LTQsCDRgdGK0LfQtNCw0LTQtdGC0LUg0LfQsNC00LDRh9CwINC90LDRgtC40YHQvdC10YLQtSDQs9C10L3QtdGA0LjRgNCw0LlcIlxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgaWQ9XCJNYXRoQ29udGFpbmVyXCI+XG5cdFx0XHRcdDxzcGFuIGlkPVwicmVzdWx0XCIgcmVmPVwicHJvYmxlbVwiPjwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gc3R5bGU9e3tkaXNwbGF5OnRoaXMucHJvcHMuc29sdXRpb25WaXNhYmxlID8gXCJibG9ja1wiIDogXCJub25lXCJ9fSByZWY9XCJzb2x1dGlvblwiPjwvc3Bhbj5cblx0XHRcdDwvZGl2Pilcblx0fVxufSlcblxuXG52YXIgSW5wdXRDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdHZpZXdzOiBbRXF1aXZhbGVudEV4cHJlc3Npb25zLEVxdWF0aW9uLFF1YWRyYXRpY0VxdWF0aW9uXSxcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB7dmlldzogXCJkaXZcIn1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2codGhpcy52aWV3cylcblx0XHRyb3V0aWUoJzAvdHlwZS86aWQnLCB0aGlzLmNoYW5nZVZpZXcpO1xuXHR9LFxuXHRjaGFuZ2VWaWV3OiBmdW5jdGlvbihpZCl7XG5cdFx0aWYoaWQgPCB0aGlzLnZpZXdzLmxlbmd0aCl7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHt2aWV3OiB0aGlzLnZpZXdzW2lkXX0pXG5cdFx0XHRtb2RlbC52aWV3X2lkID0gaWQgfCAwO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRhdGEgPSB0aGlzLnByb3BzLm1vZGVsLmRhdGFcblx0XHRyZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5zdGF0ZS52aWV3LHttb2RlbDptb2RlbH0pKTtcblx0fVxufSk7XG5cbnZhciBLYdCiZVhpdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRjb21wb25lbnREaWRNb3VudDogIGZ1bmN0aW9uKCl7XG5cblx0XHQvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMucHJvYmxlbSlcblxuXHRcdHZhciBzaGl0ID0gdGhpcy5yZWZzLnNoaXQuZ2V0RE9NTm9kZSgpXG5cdFx0a2F0ZXgucmVuZGVyKHRoaXMucHJvcHMucHJvYmxlbSxzaGl0KVxuXG5cblx0fSxcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMsIHByZXZTdGF0ZSl7XG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnByb2JsZW0pXG5cblx0XHR2YXIgc2hpdCA9IHRoaXMucmVmcy5zaGl0LmdldERPTU5vZGUoKVxuXHRcdGthdGV4LnJlbmRlcih0aGlzLnByb3BzLnByb2JsZW0sc2hpdClcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybig8c3BhbiAgcmVmPVwic2hpdFwiPjwvc3Bhbj4pXG5cdH1cbn0pXG5cbnZhciBQcmludExpc3RDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKXtcblx0XHRvZnNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5jaG9yXCIpLm9mZnNldFRvcDtcblx0XHRzY3JvbGxUbygwLG9mc2V0KVxuXHR9LFxuXHRzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG5cdFx0cmV0dXJuIG5leHRQcm9wcy5yZXNbMF0gIT09IHRoaXMucHJvcHMucmVzWzBdO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRwcm9ibGVtcyA9IHRoaXMucHJvcHMucmVzLm1hcChmdW5jdGlvbihyZXN1bHQsaXRlcil7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHJlc3VsdClcblx0XHRcdHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiPjxzcGFuIGNsYXNzTmFtZT1cIm51bVwiPntpdGVyKzF9PC9zcGFuPjxLYdCiZVhpdGVtIHByb2JsZW09e3Jlc3VsdC5wcm9ibGVtfSAvPjwvZGl2Pilcblx0XHR9KVxuXG5cdFx0c29sdXRpb24gPSB0aGlzLnByb3BzLnJlcy5tYXAoZnVuY3Rpb24ocmVzdWx0LGl0ZXIpe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhyZXN1bHQpXG5cdFx0XHRyZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIj48c3BhbiBjbGFzc05hbWU9XCJudW1cIj57aXRlcisxfTwvc3Bhbj48S2HQomVYaXRlbSBwcm9ibGVtPXtyZXN1bHQuc29sdXRpb259IC8+PC9kaXY+KVxuXHRcdH0pXG5cdFx0dmFyIHN0ID0ge31cblx0XHRpZih0aGlzLnByb3BzLnJlcy5sZW5ndGggPiAwKXtcblx0XHRcdHN0W1wiZGlzcGxheVwiXSA9IFwiYmxvY2tcIlxuXG5cblx0XHR9ZWxzZXtcblx0XHRcdHN0W1wiZGlzcGxheVwiXSA9IFwibm9uZVwiXG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblxuXHRcdFx0PGRpdiBpZD1cImFuY2hvclwiIHN0eWxlPXtzdH0gY2xhc3NOYW1lPVwibGlzdFwiPlxuXHRcdFx0XHTQl9Cw0LTQsNGH0Lg6XG5cdFx0XHRcdHtwcm9ibGVtc31cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdNCe0YLQs9C+0LLQvtGA0Lg6XG5cdFx0XHRcdHtwcm9ibGVtc31cblx0XHRcdDwvZGl2PlxuXHRcdClcblx0fVxufSk7XG5cblxudmFyIE1lbnVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWQ6IG1vZGVsLnZpZXdfaWRcblx0XHR9O1xuXHR9LFxuXHRjaGFuZ2U6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRjb25zb2xlLmxvZyhpbmRleClcblx0XHR0aGlzLnNldFN0YXRlKHtzZWxlY3RlZDogaW5kZXh9KVxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBsaXN0ID0gdGhpcy5wcm9wcy5pdGVtcy5tYXAoZnVuY3Rpb24oaXRlbSxpbmRleCl7XG5cdFx0XHR2YXIgc3R5bGUgPSBcIlwiXG5cdFx0XHRpZihzZWxmLnN0YXRlLnNlbGVjdGVkID09IGluZGV4KXtcblx0XHRcdFx0c3R5bGUgPSBcInNlbGVjdGVkXCJcblx0XHRcdH1cblx0XHRcdHJldHVybiA8YSBjbGFzc05hbWU9e3N0eWxlfSBocmVmPXtpdGVtLmhyZWZ9IG9uQ2xpY2s9e3NlbGYuY2hhbmdlLmJpbmQoc2VsZixpbmRleCl9PntpdGVtLnRleHR9PC9hPlxuXHRcdH0pXG5cdFx0cmV0dXJuICg8ZGl2PntsaXN0fTwvZGl2Pilcblx0fVxufSkgXG5cbnZhciBWaWV3Q2hhbmdlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZyh0aGlzLnByb3BzKVxuXHRcdGlmKHRoaXMucHJvcHMuaWQgPCB0aGlzLnByb3BzLnZpZXdzLmxlbmd0aCl7XG5cdFx0XHRyZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy52aWV3c1t0aGlzLnByb3BzLmlkXSx7bW9kZWw6bW9kZWx9KSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gPGRpdj48L2Rpdj5cblx0XHR9XG5cdH1cbn0pO1xuXG5cbnZhciBHZW5lcmF0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWF0aDogW3twcm9ibGVtOiBcIlwiLCBzb2x1dGlvbjogXCJcIn1dLFxuXHRcdFx0c3Y6IGZhbHNlLFxuXHRcdFx0bGlzdDogW11cblx0XHR9XG5cdH0sXG5cdHN1Ym1pdDogZnVuY3Rpb24oKXtcblx0XHRzZWxmID0gdGhpc1xuXHRcdGxvY2FsU3RvcmFnZVttb2RlbC5hZGRyZXNdID0gSlNPTi5zdHJpbmdpZnkobW9kZWwuZGF0YSlcblx0XHRzdXBlcmFnZW50LnBvc3QoXCIvYXBpXCIgKyBtb2RlbC5hZGRyZXMpLnNlbmQobW9kZWwuZGF0YSkuc2VuZCh7Y29yOjF9KS5lbmQoZnVuY3Rpb24ocmVzKXtcblx0XHRcdGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcblx0XHRcdFx0bW9kZWwucmVzID0gSlNPTi5wYXJzZShyZXMudGV4dClcblx0XHRcdFx0c2VsZi5zZXRTdGF0ZSh7bWF0aDogbW9kZWwucmVzfSlcblxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHNlbGYuc2V0U3RhdGUoe21hdGg6IHtwcm9ibGVtOiBcImVycm9yXCIsc29sdXRpb246XCIgLS0tIFwifSB9KVxuXG5cdFx0XHRcdC8va2F0ZXgucmVuZGVyKFwiZXJyb3JcIixwcm9ibGVtKVxuXG5cblx0XHRcdH1cblx0XHR9KTtcblx0XHQvL2FsZXJ0KG1hdGgpXG5cdFx0Ly9jb25zb2xlLmxvZyhtYXRoKVxuXHRcdFxuXHRcdC8vdGhpcy5zZXRTdGF0ZSh7bWF0aDogbWF0aH0pXG5cdH0sXG5cdHN1Ym1pdF9tb3JlOiBmdW5jdGlvbigpe1xuXHRcdHNlbGYgPSB0aGlzXG5cdFx0bG9jYWxTdG9yYWdlW21vZGVsLmFkZHJlc10gPSBKU09OLnN0cmluZ2lmeShtb2RlbC5kYXRhKVxuXHRcdFxuXHRcdFxuXHRcdHN1cGVyYWdlbnQucG9zdChcIi9hcGlcIiArIG1vZGVsLmFkZHJlcykuc2VuZChtb2RlbC5kYXRhKS5zZW5kKHtjb3I6MTB9KS5lbmQoZnVuY3Rpb24ocmVzKXtcblx0XHRcdGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcblx0XHRcdFx0bW9kZWwucmVzID0gSlNPTi5wYXJzZShyZXMudGV4dClcblx0XHRcdFx0Y29uc29sZS5sb2cobW9kZWwucmVzKVxuXG5cdFx0XHRcdHNlbGYuc2V0U3RhdGUoe2xpc3Q6IG1vZGVsLnJlc30pXG5cdFx0XHRcdGNvbnNvbGUubG9nKG9mc2V0KVxuXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Ly9rYXRleC5yZW5kZXIoXCJlcnJvclwiLHByb2JsZW0pXG5cblxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHQvL2FsZXJ0KG1hdGgpXG5cdFx0Ly9jb25zb2xlLmxvZyhtYXRoKVxuXHR9LFxuXHRzaG93OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuc2V0U3RhdGUoe3N2OiAhdGhpcy5zdGF0ZS5zdn0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblxuXHRcdFx0PE1hdGhDb21wb25lbnQgbWF0aD17dGhpcy5zdGF0ZS5tYXRofSBzb2x1dGlvblZpc2FibGU9e3RoaXMuc3RhdGUuc3Z9Lz5cblxuXHRcdFx0PGRpdiBpZD1cImlubmVyLWNvbnRlbnRcIiA+XG5cdFx0XHRcdFxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBvbkNsaWNrPXt0aGlzLnN1Ym1pdH0+0JPQtdC90LXRgNC40YDQsNC5PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIG9uQ2xpY2s9e3RoaXMuc3VibWl0X21vcmV9PtCT0LXQvdC10YDQuNGA0LDQuSDQvdGP0LrQvtC70LrQvjwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBvbkNsaWNrPXt0aGlzLnNob3d9PtCf0L7QutCw0LbQuC/RgdC60YDQuNC5INC+0YLQs9C+0LLQvtGA0LjRgtC1PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGRpdiBpZD1cIklucHV0Q29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQ8SW5wdXRDb21wb25lbnQgbW9kZWw9e21vZGVsfS8+XG5cdFx0XHRcdFx0PC9kaXY+XG5cblxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcblxuXHRcdFx0PC9kaXY+XG5cdFx0XHRcblx0XHRcdDxQcmludExpc3RDb21wb25lbnQgcmVzPXt0aGlzLnN0YXRlLmxpc3R9Lz5cblx0XHRcdDwvZGl2PlxuXG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBNZW51ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2aXNpYmxlOiBmYWxzZVx0XG5cdFx0fTtcblx0fSxcblxuXHRzaG93OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogdHJ1ZSB9KTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xuXHR9LFxuXG5cdGhpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZpc2libGU6IGZhbHNlIH0pO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHQ8ZGl2IGNsYXNzTmFtZT1cIlwiPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e1wic2xpZGUtbWVudS1cIisodGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlIFwiIDogXCJcIikrIFwiIHNsaWRlLW1lbnVcIn0+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+KTtcblx0fVxufSk7XG5cbnZhciBNZW51SXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0bmF2aWdhdGU6IGZ1bmN0aW9uKGhhc2gpIHtcblx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2g7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJzbGlkZS1tZW51LWl0ZW1cIiBvbkNsaWNrPXt0aGlzLm5hdmlnYXRlLmJpbmQodGhpcywgdGhpcy5wcm9wcy5oYXNoKX0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+O1xuXHR9XG59KTtcblxudmFyIEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB7XG5cdFx0XHRwYWdlOiAwLFxuXHRcdH1cblx0fSxcblx0b3Blbk1lbnU6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5yZWZzLm1lbnUuc2hvdygpXG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpe1xuXHRcdHNlbGYgPSB0aGlzXG5cdFx0cm91dGllKFwiOmlkXCIsZnVuY3Rpb24oaWQpe1xuXHRcdFx0c2VsZi5zZXRTdGF0ZSh7cGFnZTogaWQgfCAwfSlcblx0XHR9KTtcblxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKDxkaXY+XG5cblx0XHQ8bmF2PlxuXHRcdFx0PGRpdiBpZD1cInNlbGVjdFwiPlxuXHRcdFx0XHQ8YnV0dG9uIG9uQ2xpY2s9e3RoaXMub3Blbk1lbnV9PnNob3c8L2J1dHRvbj5cblx0XHRcdFx0PGxvZ28+XG5cdFx0XHRcdFx00JzQsNGC0LXQvNCw0YLQuNC60LAg0LfQsCDQstGB0LjRh9C60Lhcblx0XHRcdFx0PC9sb2dvPlxuXHRcdFx0XHQ8ZGl2IGlkPVwidXNlclwiIHN0eWxlPXt7ZmxvYXQ6XCJyaWdodFwifX0+XG5cdFx0XHRcdFx0PFVzZXJGb3JtIGRhdGE9e21vZGVsLnVzZXJ9Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblxuXHRcdDwvbmF2PlxuXG5cblx0XHQ8ZGl2IGlkPVwiY29udGVudFwiPlxuXHRcdFx0XHQ8TWVudSByZWY9XCJtZW51XCI+XG5cdFx0XHRcdFx0XHQ8TWVudUl0ZW0gaGFzaD1cIiMwLzBcIj5U0YrQttC00LXRgdGC0LLQtdC90Lgg0LjQt9GA0LDQt9C4PC9NZW51SXRlbT5cblx0XHRcdFx0XHRcdDxNZW51SXRlbSBoYXNoPVwiIzAvMVwiPtCj0YDQsNCy0L3QtdC90LjRjzwvTWVudUl0ZW0+XG5cdFx0XHRcdFx0XHQ8TWVudUl0ZW0gaGFzaD1cIiMwLzJcIj5XVEY8L01lbnVJdGVtPlxuXG5cdFx0XHRcdFx0PC9NZW51PlxuXHRcdFx0XHRcdDxWaWV3Q2hhbmdlciB2aWV3cz17W0dlbmVyYXRvcl19IGlkPXt0aGlzLnN0YXRlLnBhZ2V9IC8+XG5cdFx0PC9kaXY+XG5cdFx0XHRcdFxuXHRcdFx0XG5cblx0XHQ8L2Rpdj5cblxuXG5cdFx0KTtcblx0fVxufSk7XG5cblJlYWN0LnJlbmRlcig8QXBwLz4sZG9jdW1lbnQuYm9keSlcblxuIl19