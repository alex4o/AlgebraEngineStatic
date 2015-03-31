
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
			page: 0
		}
	},
	render: function () {
		return (React.createElement("div", null, 

		React.createElement("nav", null, 
			React.createElement("div", {id: "select"}, 

				React.createElement("logo", null, 
					"Математика за всички"
				), 
				React.createElement("div", {id: "user", style: "float:right"}, 
					React.createElement(UserForm, {data: model.user})
				)
			)

		), 


		React.createElement("div", {id: "content"}, 
				React.createElement(Menu, null, 
						React.createElement(MenuItem, {hash: "#WTF"}, "Hello"), 
						React.createElement(MenuItem, {hash: "#WTF1"}, "NoWay"), 
						React.createElement(MenuItem, {hash: "#WTF2"}, "Shit")

					), 
					React.createElement(ViewChanger, {views: [Generator], id: this.state.page})
		)
				
			

		)


		);
	}
});

React.render(React.createElement(App, null),document.body)


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZWQuanMiLCJzb3VyY2VzIjpbbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUU7QUFDRixJQUFJLEtBQUssR0FBRztDQUNYLE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQyxJQUFJLEVBQUU7O0VBRUw7Q0FDRCxNQUFNLEVBQUUsRUFBRTtDQUNWLElBQUksRUFBRTtFQUNMLElBQUksRUFBRSxFQUFFO0VBQ1IsSUFBSSxFQUFFLEVBQUU7RUFDUjtBQUNGLENBQUMsR0FBRyxFQUFFOztFQUVKO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLGtDQUFrQyxDQUFDLEdBQUcsQ0FBQztDQUMvQyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ3pFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDOUMsSUFBSTtFQUNKLE9BQU8sR0FBRztFQUNWO0FBQ0YsQ0FBQzs7QUFFRCxxQkFBcUI7QUFDckIsSUFBSSxtQ0FBbUMsNkJBQUE7QUFDdkMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLFNBQVMsRUFBRSxTQUFTLENBQUM7O0VBRWhELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtFQUM1QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7RUFDOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ2xELEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFD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QSxFQUFFLENBQUMsU0FBVSxDQUFBLEVBQUE7SUFDaEIsb0JBQUMsSUFBSSxFQUFBLElBQUMsRUFBQTtNQUNKLG9CQUFDLFFBQVEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBTyxDQUFBLEVBQUEsT0FBZ0IsQ0FBQSxFQUFBO01BQ3RDLG9CQUFDLFFBQVEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsT0FBUSxDQUFBLEVBQUEsT0FBZ0IsQ0FBQSxFQUFBO0FBQzdDLE1BQU0sb0JBQUMsUUFBUSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyxPQUFRLENBQUEsRUFBQSxNQUFlLENBQUE7O0tBRWhDLENBQUEsRUFBQTtLQUNQLG9CQUFDLFdBQVcsRUFBQSxDQUFBLENBQUMsS0FBQSxFQUFLLENBQUUsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLEVBQUEsRUFBRSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFBLENBQUcsQ0FBQTtBQUM3RCxFQUFRLENBQUE7QUFDUjtBQUNBOztBQUVBLEVBQVEsQ0FBQTtBQUNSOztJQUVJO0VBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQzs7QUFFSCxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFDLEdBQUcsRUFBQSxJQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKlxudmFyIGRhdGEgPSB7XG5cdGZyYWN0aW9uICAgIDogNTAsXG5cdG5hdHVyYWxcdFx0OiA1MCxcblx0aXJyYXRpb25hbFx0OiAwLFxuXHR1cFx0OiB7bG93OjEgLGhpZ2g6MTB9LFxuXHRkb3duOiB7bG93OjEgLGhpZ2g6MTB9XG59XG4qL1xudmFyIG1vZGVsID0ge1xuXHR2aWV3X2lkOiAwLFxuXHRkYXRhOiB7XG5cblx0fSxcblx0YWRkcmVzOiBcIlwiLFxuXHR1c2VyOiB7XG5cdFx0bmFtZTogXCJcIixcblx0XHRwYXNzOiBcIlwiXG5cdH0sXG5cdHJlcyA6e1xuXG5cdH1cbn1cblxuZnVuY3Rpb24gY2hlY2tTdG9yYWdlRm9yRGF0YU9yUmV0dXJuRGVmYXVsdChkZWYpe1xuXHRpZihsb2NhbFN0b3JhZ2VbbW9kZWwuYWRkcmVzXSAhPSBudWxsICYmIGxvY2FsU3RvcmFnZVttb2RlbC5hZGRyZXNdICE9IFwiXCIpe1xuXHRcdHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVttb2RlbC5hZGRyZXNdKTtcblx0fWVsc2V7XG5cdFx0cmV0dXJuIGRlZlxuXHR9XG59XG5cbi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIE1hdGhDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGNvbXBvbmVudERpZFVwZGF0ZTpmdW5jdGlvbihwcmV2UHJvcHMsIHByZXZTdGF0ZSl7XG5cblx0XHR2YXIgcHJvYmxlbSA9IHRoaXMucmVmcy5wcm9ibGVtLmdldERPTU5vZGUoKVxuXHRcdHZhciBzb2x1dGlvbiA9IHRoaXMucmVmcy5zb2x1dGlvbi5nZXRET01Ob2RlKClcblx0XHRrYXRleC5yZW5kZXIodGhpcy5wcm9wcy5tYXRoWzBdLnByb2JsZW0scHJvYmxlbSlcblx0XHRrYXRleC5yZW5kZXIodGhpcy5wcm9wcy5tYXRoWzBdLnNvbHV0aW9uLHNvbHV0aW9uKVxuXHRcdFxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZWZzLnByb2JsZW0uZ2V0RE9NTm9kZSgpLmlubmVySFRNTCA9IFwi0JfQsCDQtNCwINGB0YrQt9C00LDQtNC10YLQtSDQt9Cw0LTQsNGH0LAg0L3QsNGC0LjRgdC90LXRgtC1INCz0LXQvdC10YDQuNGA0LDQuVwiXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBpZD1cIk1hdGhDb250YWluZXJcIj5cblx0XHRcdFx0PHNwYW4gaWQ9XCJyZXN1bHRcIiByZWY9XCJwcm9ibGVtXCI+PC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBzdHlsZT17e2Rpc3BsYXk6dGhpcy5wcm9wcy5zb2x1dGlvblZpc2FibGUgPyBcImJsb2NrXCIgOiBcIm5vbmVcIn19IHJlZj1cInNvbHV0aW9uXCI+PC9zcGFuPlxuXHRcdFx0PC9kaXY+KVxuXHR9XG59KVxuXG5cbnZhciBJbnB1dENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0dmlld3M6IFtFcXVpdmFsZW50RXhwcmVzc2lvbnMsRXF1YXRpb24sUXVhZHJhdGljRXF1YXRpb25dLFxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHt2aWV3OiBcImRpdlwifVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyh0aGlzLnZpZXdzKVxuXHRcdHJvdXRpZSgncHJvYmxlbXMvdHlwZS86aWQnLCB0aGlzLmNoYW5nZVZpZXcpO1xuXHR9LFxuXHRjaGFuZ2VWaWV3OiBmdW5jdGlvbihpZCl7XG5cdFx0aWYoaWQgPCB0aGlzLnZpZXdzLmxlbmd0aCl7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHt2aWV3OiB0aGlzLnZpZXdzW2lkXX0pXG5cdFx0XHRtb2RlbC52aWV3X2lkID0gaWQgfCAwO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRhdGEgPSB0aGlzLnByb3BzLm1vZGVsLmRhdGFcblx0XHRyZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5zdGF0ZS52aWV3LHttb2RlbDptb2RlbH0pKTtcblx0fVxufSk7XG5cbnZhciBLYdCiZVhpdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRjb21wb25lbnREaWRNb3VudDogIGZ1bmN0aW9uKCl7XG5cblx0XHQvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMucHJvYmxlbSlcblxuXHRcdHZhciBzaGl0ID0gdGhpcy5yZWZzLnNoaXQuZ2V0RE9NTm9kZSgpXG5cdFx0a2F0ZXgucmVuZGVyKHRoaXMucHJvcHMucHJvYmxlbSxzaGl0KVxuXG5cblx0fSxcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMsIHByZXZTdGF0ZSl7XG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnByb2JsZW0pXG5cblx0XHR2YXIgc2hpdCA9IHRoaXMucmVmcy5zaGl0LmdldERPTU5vZGUoKVxuXHRcdGthdGV4LnJlbmRlcih0aGlzLnByb3BzLnByb2JsZW0sc2hpdClcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybig8c3BhbiAgcmVmPVwic2hpdFwiPjwvc3Bhbj4pXG5cdH1cbn0pXG5cbnZhciBQcmludExpc3RDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24oKXtcblx0XHRvZnNldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYW5jaG9yXCIpLm9mZnNldFRvcDtcblx0XHRzY3JvbGxUbygwLG9mc2V0KVxuXHR9LFxuXHRzaG91bGRDb21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG5cdFx0cmV0dXJuIG5leHRQcm9wcy5yZXNbMF0gIT09IHRoaXMucHJvcHMucmVzWzBdO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRwcm9ibGVtcyA9IHRoaXMucHJvcHMucmVzLm1hcChmdW5jdGlvbihyZXN1bHQsaXRlcil7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHJlc3VsdClcblx0XHRcdHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiPjxzcGFuIGNsYXNzTmFtZT1cIm51bVwiPntpdGVyKzF9PC9zcGFuPjxLYdCiZVhpdGVtIHByb2JsZW09e3Jlc3VsdC5wcm9ibGVtfSAvPjwvZGl2Pilcblx0XHR9KVxuXG5cdFx0c29sdXRpb24gPSB0aGlzLnByb3BzLnJlcy5tYXAoZnVuY3Rpb24ocmVzdWx0LGl0ZXIpe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhyZXN1bHQpXG5cdFx0XHRyZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIj48c3BhbiBjbGFzc05hbWU9XCJudW1cIj57aXRlcisxfTwvc3Bhbj48S2HQomVYaXRlbSBwcm9ibGVtPXtyZXN1bHQuc29sdXRpb259IC8+PC9kaXY+KVxuXHRcdH0pXG5cdFx0dmFyIHN0ID0ge31cblx0XHRpZih0aGlzLnByb3BzLnJlcy5sZW5ndGggPiAwKXtcblx0XHRcdHN0W1wiZGlzcGxheVwiXSA9IFwiYmxvY2tcIlxuXG5cblx0XHR9ZWxzZXtcblx0XHRcdHN0W1wiZGlzcGxheVwiXSA9IFwibm9uZVwiXG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblxuXHRcdFx0PGRpdiBpZD1cImFuY2hvclwiIHN0eWxlPXtzdH0gY2xhc3NOYW1lPVwibGlzdFwiPlxuXHRcdFx0XHTQl9Cw0LTQsNGH0Lg6XG5cdFx0XHRcdHtwcm9ibGVtc31cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdNCe0YLQs9C+0LLQvtGA0Lg6XG5cdFx0XHRcdHtwcm9ibGVtc31cblx0XHRcdDwvZGl2PlxuXHRcdClcblx0fVxufSk7XG5cblxudmFyIE1lbnVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0ZWQ6IG1vZGVsLnZpZXdfaWRcblx0XHR9O1xuXHR9LFxuXHRjaGFuZ2U6IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRjb25zb2xlLmxvZyhpbmRleClcblx0XHR0aGlzLnNldFN0YXRlKHtzZWxlY3RlZDogaW5kZXh9KVxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBsaXN0ID0gdGhpcy5wcm9wcy5pdGVtcy5tYXAoZnVuY3Rpb24oaXRlbSxpbmRleCl7XG5cdFx0XHR2YXIgc3R5bGUgPSBcIlwiXG5cdFx0XHRpZihzZWxmLnN0YXRlLnNlbGVjdGVkID09IGluZGV4KXtcblx0XHRcdFx0c3R5bGUgPSBcInNlbGVjdGVkXCJcblx0XHRcdH1cblx0XHRcdHJldHVybiA8YSBjbGFzc05hbWU9e3N0eWxlfSBocmVmPXtpdGVtLmhyZWZ9IG9uQ2xpY2s9e3NlbGYuY2hhbmdlLmJpbmQoc2VsZixpbmRleCl9PntpdGVtLnRleHR9PC9hPlxuXHRcdH0pXG5cdFx0cmV0dXJuICg8ZGl2PntsaXN0fTwvZGl2Pilcblx0fVxufSkgXG5cbnZhciBWaWV3Q2hhbmdlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZyh0aGlzLnByb3BzKVxuXHRcdGlmKHRoaXMucHJvcHMuaWQgPCB0aGlzLnByb3BzLnZpZXdzLmxlbmd0aCl7XG5cdFx0XHRyZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5wcm9wcy52aWV3c1t0aGlzLnByb3BzLmlkXSx7bW9kZWw6bW9kZWx9KSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gPGRpdj48L2Rpdj5cblx0XHR9XG5cdH1cbn0pO1xuXG5cbnZhciBHZW5lcmF0b3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWF0aDogW3twcm9ibGVtOiBcIlwiLCBzb2x1dGlvbjogXCJcIn1dLFxuXHRcdFx0c3Y6IGZhbHNlLFxuXHRcdFx0bGlzdDogW11cblx0XHR9XG5cdH0sXG5cdHN1Ym1pdDogZnVuY3Rpb24oKXtcblx0XHRzZWxmID0gdGhpc1xuXHRcdGxvY2FsU3RvcmFnZVttb2RlbC5hZGRyZXNdID0gSlNPTi5zdHJpbmdpZnkobW9kZWwuZGF0YSlcblx0XHRzdXBlcmFnZW50LnBvc3QoXCIvYXBpXCIgKyBtb2RlbC5hZGRyZXMpLnNlbmQobW9kZWwuZGF0YSkuc2VuZCh7Y29yOjF9KS5lbmQoZnVuY3Rpb24ocmVzKXtcblx0XHRcdGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcblx0XHRcdFx0bW9kZWwucmVzID0gSlNPTi5wYXJzZShyZXMudGV4dClcblx0XHRcdFx0c2VsZi5zZXRTdGF0ZSh7bWF0aDogbW9kZWwucmVzfSlcblxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHNlbGYuc2V0U3RhdGUoe21hdGg6IHtwcm9ibGVtOiBcImVycm9yXCIsc29sdXRpb246XCIgLS0tIFwifSB9KVxuXG5cdFx0XHRcdC8va2F0ZXgucmVuZGVyKFwiZXJyb3JcIixwcm9ibGVtKVxuXG5cblx0XHRcdH1cblx0XHR9KTtcblx0XHQvL2FsZXJ0KG1hdGgpXG5cdFx0Ly9jb25zb2xlLmxvZyhtYXRoKVxuXHRcdFxuXHRcdC8vdGhpcy5zZXRTdGF0ZSh7bWF0aDogbWF0aH0pXG5cdH0sXG5cdHN1Ym1pdF9tb3JlOiBmdW5jdGlvbigpe1xuXHRcdHNlbGYgPSB0aGlzXG5cdFx0bG9jYWxTdG9yYWdlW21vZGVsLmFkZHJlc10gPSBKU09OLnN0cmluZ2lmeShtb2RlbC5kYXRhKVxuXHRcdFxuXHRcdFxuXHRcdHN1cGVyYWdlbnQucG9zdChcIi9hcGlcIiArIG1vZGVsLmFkZHJlcykuc2VuZChtb2RlbC5kYXRhKS5zZW5kKHtjb3I6MTB9KS5lbmQoZnVuY3Rpb24ocmVzKXtcblx0XHRcdGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcblx0XHRcdFx0bW9kZWwucmVzID0gSlNPTi5wYXJzZShyZXMudGV4dClcblx0XHRcdFx0Y29uc29sZS5sb2cobW9kZWwucmVzKVxuXG5cdFx0XHRcdHNlbGYuc2V0U3RhdGUoe2xpc3Q6IG1vZGVsLnJlc30pXG5cdFx0XHRcdGNvbnNvbGUubG9nKG9mc2V0KVxuXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Ly9rYXRleC5yZW5kZXIoXCJlcnJvclwiLHByb2JsZW0pXG5cblxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHQvL2FsZXJ0KG1hdGgpXG5cdFx0Ly9jb25zb2xlLmxvZyhtYXRoKVxuXHR9LFxuXHRzaG93OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuc2V0U3RhdGUoe3N2OiAhdGhpcy5zdGF0ZS5zdn0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblxuXHRcdFx0PE1hdGhDb21wb25lbnQgbWF0aD17dGhpcy5zdGF0ZS5tYXRofSBzb2x1dGlvblZpc2FibGU9e3RoaXMuc3RhdGUuc3Z9Lz5cblxuXHRcdFx0PGRpdiBpZD1cInNpZGViYXJcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIml0ZW1cIj5cblx0XHRcdFx0XHRcdDxzcGFuPjcg0LrQu9Cw0YE8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8TWVudUxpc3QgaXRlbXM9e1tcblx0XHRcdFx0XHRcdFx0e2hyZWY6IFwiI3Byb2JsZW1zL3R5cGUvMFwiLCB0ZXh0OlwiVNGK0LbQtNC10YHRgtCy0LXQvdC4INC40LfRgNCw0LfQuFwifSxcblx0XHRcdFx0XHRcdFx0e2hyZWY6IFwiI3Byb2JsZW1zL3R5cGUvMVwiLCB0ZXh0Olwi0KPRgNCw0LLQvdC10L3QuNGPXCJ9XG5cdFx0XHRcdFx0XHRcdF19IC8+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblxuXHRcdFx0PGRpdiBpZD1cImlubmVyLWNvbnRlbnRcIiA+XG5cdFx0XHRcdFxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBvbkNsaWNrPXt0aGlzLnN1Ym1pdH0+0JPQtdC90LXRgNC40YDQsNC5PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIG9uQ2xpY2s9e3RoaXMuc3VibWl0X21vcmV9PtCT0LXQvdC10YDQuNGA0LDQuSDQvdGP0LrQvtC70LrQvjwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBvbkNsaWNrPXt0aGlzLnNob3d9PtCf0L7QutCw0LbQuC/RgdC60YDQuNC5INC+0YLQs9C+0LLQvtGA0LjRgtC1PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGRpdiBpZD1cIklucHV0Q29udGFpbmVyXCI+XG5cdFx0XHRcdFx0XHQ8SW5wdXRDb21wb25lbnQgbW9kZWw9e21vZGVsfS8+XG5cdFx0XHRcdFx0PC9kaXY+XG5cblxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcblxuXHRcdFx0PC9kaXY+XG5cdFx0XHRcblx0XHRcdDxQcmludExpc3RDb21wb25lbnQgcmVzPXt0aGlzLnN0YXRlLmxpc3R9Lz5cblx0XHRcdDwvZGl2PlxuXG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBNZW51ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2aXNpYmxlOiBmYWxzZVx0XG5cdFx0fTtcblx0fSxcblxuXHRzaG93OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogdHJ1ZSB9KTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xuXHR9LFxuXG5cdGhpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZpc2libGU6IGZhbHNlIH0pO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHQ8ZGl2IGNsYXNzTmFtZT1cIlwiPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e1wic2xpZGUtbWVudS1cIisodGhpcy5zdGF0ZS52aXNpYmxlID8gXCJ2aXNpYmxlIFwiIDogXCJcIikrIFwiIHNsaWRlLW1lbnVcIn0+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+KTtcblx0fVxufSk7XG5cbnZhciBNZW51SXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0bmF2aWdhdGU6IGZ1bmN0aW9uKGhhc2gpIHtcblx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IGhhc2g7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJzbGlkZS1tZW51LWl0ZW1cIiBvbkNsaWNrPXt0aGlzLm5hdmlnYXRlLmJpbmQodGhpcywgdGhpcy5wcm9wcy5oYXNoKX0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+O1xuXHR9XG59KTtcblxudmFyIEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB7XG5cdFx0XHRwYWdlOiAwXG5cdFx0fVxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKDxkaXY+XG5cblx0XHQ8bmF2PlxuXHRcdFx0PGRpdiBpZD1cInNlbGVjdFwiPlxuXG5cdFx0XHRcdDxsb2dvPlxuXHRcdFx0XHRcdNCc0LDRgtC10LzQsNGC0LjQutCwINC30LAg0LLRgdC40YfQutC4XG5cdFx0XHRcdDwvbG9nbz5cblx0XHRcdFx0PGRpdiBpZD1cInVzZXJcIiBzdHlsZT1cImZsb2F0OnJpZ2h0XCI+XG5cdFx0XHRcdFx0PFVzZXJGb3JtIGRhdGE9e21vZGVsLnVzZXJ9Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblxuXHRcdDwvbmF2PlxuXG5cblx0XHQ8ZGl2IGlkPVwiY29udGVudFwiPlxuXHRcdFx0XHQ8TWVudT5cblx0XHRcdFx0XHRcdDxNZW51SXRlbSBoYXNoPVwiI1dURlwiPkhlbGxvPC9NZW51SXRlbT5cblx0XHRcdFx0XHRcdDxNZW51SXRlbSBoYXNoPVwiI1dURjFcIj5Ob1dheTwvTWVudUl0ZW0+XG5cdFx0XHRcdFx0XHQ8TWVudUl0ZW0gaGFzaD1cIiNXVEYyXCI+U2hpdDwvTWVudUl0ZW0+XG5cblx0XHRcdFx0XHQ8L01lbnU+XG5cdFx0XHRcdFx0PFZpZXdDaGFuZ2VyIHZpZXdzPXtbR2VuZXJhdG9yXX0gaWQ9e3RoaXMuc3RhdGUucGFnZX0gLz5cblx0XHQ8L2Rpdj5cblx0XHRcdFx0XG5cdFx0XHRcblxuXHRcdDwvZGl2PlxuXG5cblx0XHQpO1xuXHR9XG59KTtcblxuUmVhY3QucmVuZGVyKDxBcHAvPixkb2N1bWVudC5ib2R5KVxuXG4iXX0=