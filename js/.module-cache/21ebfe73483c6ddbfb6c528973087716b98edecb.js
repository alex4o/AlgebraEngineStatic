
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
						React.createElement(MenuItem, {hash: "#problems/type/0"}, "Tъждествени изрази"), 
						React.createElement(MenuItem, {hash: "#problems/type/1"}, "Уравнения"), 
						React.createElement(MenuItem, {hash: "#problems/type/2"}, "WTF")

					), 
					React.createElement(ViewChanger, {views: [Generator], id: this.state.page})
		)
				
			

		)


		);
	}
});

React.render(React.createElement(App, null),document.body)


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZWQuanMiLCJzb3VyY2VzIjpbbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUU7QUFDRixJQUFJLEtBQUssR0FBRztDQUNYLE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQyxJQUFJLEVBQUU7O0VBRUw7Q0FDRCxNQUFNLEVBQUUsRUFBRTtDQUNWLElBQUksRUFBRTtFQUNMLElBQUksRUFBRSxFQUFFO0VBQ1IsSUFBSSxFQUFFLEVBQUU7RUFDUjtBQUNGLENBQUMsR0FBRyxFQUFFOztFQUVKO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLGtDQUFrQyxDQUFDLEdBQUcsQ0FBQztDQUMvQyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ3pFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDOUMsSUFBSTtFQUNKLE9BQU8sR0FBRztFQUNWO0FBQ0YsQ0FBQzs7QUFFRCxxQkFBcUI7QUFDckIsSUFBSSxtQ0FBbUMsNkJBQUE7QUFDdkMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLFNBQVMsRUFBRSxTQUFTLENBQUM7O0VBRWhELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtFQUM1QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7RUFDOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ2xELEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFD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QSxFQUFJLENBQUMsa0JBQW1CLENBQUEsRUFBQSxXQUFvQixDQUFBLEVBQUE7QUFDNUQsTUFBTSxvQkFBQyxRQUFRLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLGtCQUFtQixDQUFBLEVBQUEsS0FBYyxDQUFBOztLQUUxQyxDQUFBLEVBQUE7S0FDUCxvQkFBQyxXQUFXLEVBQUEsQ0FBQSxDQUFDLEtBQUEsRUFBSyxDQUFFLENBQUMsU0FBUyxDQUFDLEVBQUMsQ0FBQyxFQUFBLEVBQUUsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQSxDQUFHLENBQUE7QUFDN0QsRUFBUSxDQUFBO0FBQ1I7QUFDQTs7QUFFQSxFQUFRLENBQUE7QUFDUjs7SUFFSTtFQUNGO0FBQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUgsS0FBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxHQUFHLEVBQUEsSUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLypcbnZhciBkYXRhID0ge1xuXHRmcmFjdGlvbiAgICA6IDUwLFxuXHRuYXR1cmFsXHRcdDogNTAsXG5cdGlycmF0aW9uYWxcdDogMCxcblx0dXBcdDoge2xvdzoxICxoaWdoOjEwfSxcblx0ZG93bjoge2xvdzoxICxoaWdoOjEwfVxufVxuKi9cbnZhciBtb2RlbCA9IHtcblx0dmlld19pZDogMCxcblx0ZGF0YToge1xuXG5cdH0sXG5cdGFkZHJlczogXCJcIixcblx0dXNlcjoge1xuXHRcdG5hbWU6IFwiXCIsXG5cdFx0cGFzczogXCJcIlxuXHR9LFxuXHRyZXMgOntcblxuXHR9XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RvcmFnZUZvckRhdGFPclJldHVybkRlZmF1bHQoZGVmKXtcblx0aWYobG9jYWxTdG9yYWdlW21vZGVsLmFkZHJlc10gIT0gbnVsbCAmJiBsb2NhbFN0b3JhZ2VbbW9kZWwuYWRkcmVzXSAhPSBcIlwiKXtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbW9kZWwuYWRkcmVzXSk7XG5cdH1lbHNle1xuXHRcdHJldHVybiBkZWZcblx0fVxufVxuXG4vKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBNYXRoQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRjb21wb25lbnREaWRVcGRhdGU6ZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpe1xuXG5cdFx0dmFyIHByb2JsZW0gPSB0aGlzLnJlZnMucHJvYmxlbS5nZXRET01Ob2RlKClcblx0XHR2YXIgc29sdXRpb24gPSB0aGlzLnJlZnMuc29sdXRpb24uZ2V0RE9NTm9kZSgpXG5cdFx0a2F0ZXgucmVuZGVyKHRoaXMucHJvcHMubWF0aFswXS5wcm9ibGVtLHByb2JsZW0pXG5cdFx0a2F0ZXgucmVuZGVyKHRoaXMucHJvcHMubWF0aFswXS5zb2x1dGlvbixzb2x1dGlvbilcblx0XHRcblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVmcy5wcm9ibGVtLmdldERPTU5vZGUoKS5pbm5lckhUTUwgPSBcItCX0LAg0LTQsCDRgdGK0LfQtNCw0LTQtdGC0LUg0LfQsNC00LDRh9CwINC90LDRgtC40YHQvdC10YLQtSDQs9C10L3QtdGA0LjRgNCw0LlcIlxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgaWQ9XCJNYXRoQ29udGFpbmVyXCI+XG5cdFx0XHRcdDxzcGFuIGlkPVwicmVzdWx0XCIgcmVmPVwicHJvYmxlbVwiPjwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gc3R5bGU9e3tkaXNwbGF5OnRoaXMucHJvcHMuc29sdXRpb25WaXNhYmxlID8gXCJibG9ja1wiIDogXCJub25lXCJ9fSByZWY9XCJzb2x1dGlvblwiPjwvc3Bhbj5cblx0XHRcdDwvZGl2Pilcblx0fVxufSlcblxuXG52YXIgSW5wdXRDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdHZpZXdzOiBbRXF1aXZhbGVudEV4cHJlc3Npb25zLEVxdWF0aW9uLFF1YWRyYXRpY0VxdWF0aW9uXSxcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB7dmlldzogXCJkaXZcIn1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2codGhpcy52aWV3cylcblx0XHRyb3V0aWUoJ3Byb2JsZW1zL3R5cGUvOmlkJywgdGhpcy5jaGFuZ2VWaWV3KTtcblx0fSxcblx0Y2hhbmdlVmlldzogZnVuY3Rpb24oaWQpe1xuXHRcdGlmKGlkIDwgdGhpcy52aWV3cy5sZW5ndGgpe1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7dmlldzogdGhpcy52aWV3c1tpZF19KVxuXHRcdFx0bW9kZWwudmlld19pZCA9IGlkIHwgMDtcblx0XHR9XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBkYXRhID0gdGhpcy5wcm9wcy5tb2RlbC5kYXRhXG5cdFx0cmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KHRoaXMuc3RhdGUudmlldyx7bW9kZWw6bW9kZWx9KSk7XG5cdH1cbn0pO1xuXG52YXIgS2HQomVYaXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Y29tcG9uZW50RGlkTW91bnQ6ICBmdW5jdGlvbigpe1xuXG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnByb2JsZW0pXG5cblx0XHR2YXIgc2hpdCA9IHRoaXMucmVmcy5zaGl0LmdldERPTU5vZGUoKVxuXHRcdGthdGV4LnJlbmRlcih0aGlzLnByb3BzLnByb2JsZW0sc2hpdClcblxuXG5cdH0sXG5cdGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpe1xuXHRcdC8vY29uc29sZS5sb2codGhpcy5wcm9wcy5wcm9ibGVtKVxuXG5cdFx0dmFyIHNoaXQgPSB0aGlzLnJlZnMuc2hpdC5nZXRET01Ob2RlKClcblx0XHRrYXRleC5yZW5kZXIodGhpcy5wcm9wcy5wcm9ibGVtLHNoaXQpXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4oPHNwYW4gIHJlZj1cInNoaXRcIj48L3NwYW4+KVxuXHR9XG59KVxuXG52YXIgUHJpbnRMaXN0Q29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0b2ZzZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFuY2hvclwiKS5vZmZzZXRUb3A7XG5cdFx0c2Nyb2xsVG8oMCxvZnNldClcblx0fSxcblx0c2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuXHRcdHJldHVybiBuZXh0UHJvcHMucmVzWzBdICE9PSB0aGlzLnByb3BzLnJlc1swXTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0cHJvYmxlbXMgPSB0aGlzLnByb3BzLnJlcy5tYXAoZnVuY3Rpb24ocmVzdWx0LGl0ZXIpe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhyZXN1bHQpXG5cdFx0XHRyZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIj48c3BhbiBjbGFzc05hbWU9XCJudW1cIj57aXRlcisxfTwvc3Bhbj48S2HQomVYaXRlbSBwcm9ibGVtPXtyZXN1bHQucHJvYmxlbX0gLz48L2Rpdj4pXG5cdFx0fSlcblxuXHRcdHNvbHV0aW9uID0gdGhpcy5wcm9wcy5yZXMubWFwKGZ1bmN0aW9uKHJlc3VsdCxpdGVyKXtcblx0XHRcdC8vY29uc29sZS5sb2cocmVzdWx0KVxuXHRcdFx0cmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cIml0ZW1zXCI+PHNwYW4gY2xhc3NOYW1lPVwibnVtXCI+e2l0ZXIrMX08L3NwYW4+PEth0KJlWGl0ZW0gcHJvYmxlbT17cmVzdWx0LnNvbHV0aW9ufSAvPjwvZGl2Pilcblx0XHR9KVxuXHRcdHZhciBzdCA9IHt9XG5cdFx0aWYodGhpcy5wcm9wcy5yZXMubGVuZ3RoID4gMCl7XG5cdFx0XHRzdFtcImRpc3BsYXlcIl0gPSBcImJsb2NrXCJcblxuXG5cdFx0fWVsc2V7XG5cdFx0XHRzdFtcImRpc3BsYXlcIl0gPSBcIm5vbmVcIlxuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cblx0XHRcdDxkaXYgaWQ9XCJhbmNob3JcIiBzdHlsZT17c3R9IGNsYXNzTmFtZT1cImxpc3RcIj5cblx0XHRcdFx00JfQsNC00LDRh9C4OlxuXHRcdFx0XHR7cHJvYmxlbXN9XG5cdFx0XHRcdDxiciAvPlxuXHRcdFx0XHTQntGC0LPQvtCy0L7RgNC4OlxuXHRcdFx0XHR7cHJvYmxlbXN9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpXG5cdH1cbn0pO1xuXG5cbnZhciBNZW51TGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdGVkOiBtb2RlbC52aWV3X2lkXG5cdFx0fTtcblx0fSxcblx0Y2hhbmdlOiBmdW5jdGlvbihpbmRleCl7XG5cdFx0Y29uc29sZS5sb2coaW5kZXgpXG5cdFx0dGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWQ6IGluZGV4fSlcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgbGlzdCA9IHRoaXMucHJvcHMuaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0saW5kZXgpe1xuXHRcdFx0dmFyIHN0eWxlID0gXCJcIlxuXHRcdFx0aWYoc2VsZi5zdGF0ZS5zZWxlY3RlZCA9PSBpbmRleCl7XG5cdFx0XHRcdHN0eWxlID0gXCJzZWxlY3RlZFwiXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gPGEgY2xhc3NOYW1lPXtzdHlsZX0gaHJlZj17aXRlbS5ocmVmfSBvbkNsaWNrPXtzZWxmLmNoYW5nZS5iaW5kKHNlbGYsaW5kZXgpfT57aXRlbS50ZXh0fTwvYT5cblx0XHR9KVxuXHRcdHJldHVybiAoPGRpdj57bGlzdH08L2Rpdj4pXG5cdH1cbn0pIFxuXG52YXIgVmlld0NoYW5nZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2codGhpcy5wcm9wcylcblx0XHRpZih0aGlzLnByb3BzLmlkIDwgdGhpcy5wcm9wcy52aWV3cy5sZW5ndGgpe1xuXHRcdFx0cmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KHRoaXMucHJvcHMudmlld3NbdGhpcy5wcm9wcy5pZF0se21vZGVsOm1vZGVsfSkpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIDxkaXY+PC9kaXY+XG5cdFx0fVxuXHR9XG59KTtcblxuXG52YXIgR2VuZXJhdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1hdGg6IFt7cHJvYmxlbTogXCJcIiwgc29sdXRpb246IFwiXCJ9XSxcblx0XHRcdHN2OiBmYWxzZSxcblx0XHRcdGxpc3Q6IFtdXG5cdFx0fVxuXHR9LFxuXHRzdWJtaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0c2VsZiA9IHRoaXNcblx0XHRsb2NhbFN0b3JhZ2VbbW9kZWwuYWRkcmVzXSA9IEpTT04uc3RyaW5naWZ5KG1vZGVsLmRhdGEpXG5cdFx0c3VwZXJhZ2VudC5wb3N0KFwiL2FwaVwiICsgbW9kZWwuYWRkcmVzKS5zZW5kKG1vZGVsLmRhdGEpLnNlbmQoe2NvcjoxfSkuZW5kKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRpZihyZXMuc3RhdHVzID09IDIwMCl7XG5cdFx0XHRcdG1vZGVsLnJlcyA9IEpTT04ucGFyc2UocmVzLnRleHQpXG5cdFx0XHRcdHNlbGYuc2V0U3RhdGUoe21hdGg6IG1vZGVsLnJlc30pXG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHRzZWxmLnNldFN0YXRlKHttYXRoOiB7cHJvYmxlbTogXCJlcnJvclwiLHNvbHV0aW9uOlwiIC0tLSBcIn0gfSlcblxuXHRcdFx0XHQvL2thdGV4LnJlbmRlcihcImVycm9yXCIscHJvYmxlbSlcblxuXG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Ly9hbGVydChtYXRoKVxuXHRcdC8vY29uc29sZS5sb2cobWF0aClcblx0XHRcblx0XHQvL3RoaXMuc2V0U3RhdGUoe21hdGg6IG1hdGh9KVxuXHR9LFxuXHRzdWJtaXRfbW9yZTogZnVuY3Rpb24oKXtcblx0XHRzZWxmID0gdGhpc1xuXHRcdGxvY2FsU3RvcmFnZVttb2RlbC5hZGRyZXNdID0gSlNPTi5zdHJpbmdpZnkobW9kZWwuZGF0YSlcblx0XHRcblx0XHRcblx0XHRzdXBlcmFnZW50LnBvc3QoXCIvYXBpXCIgKyBtb2RlbC5hZGRyZXMpLnNlbmQobW9kZWwuZGF0YSkuc2VuZCh7Y29yOjEwfSkuZW5kKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRpZihyZXMuc3RhdHVzID09IDIwMCl7XG5cdFx0XHRcdG1vZGVsLnJlcyA9IEpTT04ucGFyc2UocmVzLnRleHQpXG5cdFx0XHRcdGNvbnNvbGUubG9nKG1vZGVsLnJlcylcblxuXHRcdFx0XHRzZWxmLnNldFN0YXRlKHtsaXN0OiBtb2RlbC5yZXN9KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhvZnNldClcblxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdC8va2F0ZXgucmVuZGVyKFwiZXJyb3JcIixwcm9ibGVtKVxuXG5cblx0XHRcdH1cblx0XHR9KTtcblxuXG5cdFx0Ly9hbGVydChtYXRoKVxuXHRcdC8vY29uc29sZS5sb2cobWF0aClcblx0fSxcblx0c2hvdzogZnVuY3Rpb24oKXtcblx0XHR0aGlzLnNldFN0YXRlKHtzdjogIXRoaXMuc3RhdGUuc3Z9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXY+XG5cblx0XHRcdDxNYXRoQ29tcG9uZW50IG1hdGg9e3RoaXMuc3RhdGUubWF0aH0gc29sdXRpb25WaXNhYmxlPXt0aGlzLnN0YXRlLnN2fS8+XG5cblx0XHRcdDxkaXYgaWQ9XCJpbm5lci1jb250ZW50XCIgPlxuXHRcdFx0XHRcblx0XHRcdFx0PGRpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgb25DbGljaz17dGhpcy5zdWJtaXR9PtCT0LXQvdC10YDQuNGA0LDQuTwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtZW51LWl0ZW1cIiBvbkNsaWNrPXt0aGlzLnN1Ym1pdF9tb3JlfT7Qk9C10L3QtdGA0LjRgNCw0Lkg0L3Rj9C60L7Qu9C60L48L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgb25DbGljaz17dGhpcy5zaG93fT7Qn9C+0LrQsNC20Lgv0YHQutGA0LjQuSDQvtGC0LPQvtCy0L7RgNC40YLQtTwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxkaXYgaWQ9XCJJbnB1dENvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0PElucHV0Q29tcG9uZW50IG1vZGVsPXttb2RlbH0vPlxuXHRcdFx0XHRcdDwvZGl2PlxuXG5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XG5cblx0XHRcdDwvZGl2PlxuXHRcdFx0XG5cdFx0XHQ8UHJpbnRMaXN0Q29tcG9uZW50IHJlcz17dGhpcy5zdGF0ZS5saXN0fS8+XG5cdFx0XHQ8L2Rpdj5cblxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgTWVudSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmlzaWJsZTogZmFsc2VcdFxuXHRcdH07XG5cdH0sXG5cblx0c2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IHZpc2libGU6IHRydWUgfSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcblx0fSxcblxuXHRoaWRlOiBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xuXHRcdHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlOiBmYWxzZSB9KTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0PGRpdiBjbGFzc05hbWU9XCJcIj5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtcInNsaWRlLW1lbnUtXCIrKHRoaXMuc3RhdGUudmlzaWJsZSA/IFwidmlzaWJsZSBcIiA6IFwiXCIpKyBcIiBzbGlkZS1tZW51XCJ9PlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2Pik7XG5cdH1cbn0pO1xuXG52YXIgTWVudUl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdG5hdmlnYXRlOiBmdW5jdGlvbihoYXNoKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBoYXNoO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwic2xpZGUtbWVudS1pdGVtXCIgb25DbGljaz17dGhpcy5uYXZpZ2F0ZS5iaW5kKHRoaXMsIHRoaXMucHJvcHMuaGFzaCl9Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2Pjtcblx0fVxufSk7XG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFnZTogMCxcblx0XHR9XG5cdH0sXG5cdG9wZW5NZW51OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMucmVmcy5tZW51LnNob3coKVxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKDxkaXY+XG5cblx0XHQ8bmF2PlxuXHRcdFx0PGRpdiBpZD1cInNlbGVjdFwiPlxuXHRcdFx0XHQ8YnV0dG9uIG9uQ2xpY2s9e3RoaXMub3Blbk1lbnV9PnNob3c8L2J1dHRvbj5cblx0XHRcdFx0PGxvZ28+XG5cdFx0XHRcdFx00JzQsNGC0LXQvNCw0YLQuNC60LAg0LfQsCDQstGB0LjRh9C60Lhcblx0XHRcdFx0PC9sb2dvPlxuXHRcdFx0XHQ8ZGl2IGlkPVwidXNlclwiIHN0eWxlPXt7ZmxvYXQ6XCJyaWdodFwifX0+XG5cdFx0XHRcdFx0PFVzZXJGb3JtIGRhdGE9e21vZGVsLnVzZXJ9Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblxuXHRcdDwvbmF2PlxuXG5cblx0XHQ8ZGl2IGlkPVwiY29udGVudFwiPlxuXHRcdFx0XHQ8TWVudSByZWY9XCJtZW51XCI+XG5cdFx0XHRcdFx0XHQ8TWVudUl0ZW0gaGFzaD1cIiNwcm9ibGVtcy90eXBlLzBcIj5U0YrQttC00LXRgdGC0LLQtdC90Lgg0LjQt9GA0LDQt9C4PC9NZW51SXRlbT5cblx0XHRcdFx0XHRcdDxNZW51SXRlbSBoYXNoPVwiI3Byb2JsZW1zL3R5cGUvMVwiPtCj0YDQsNCy0L3QtdC90LjRjzwvTWVudUl0ZW0+XG5cdFx0XHRcdFx0XHQ8TWVudUl0ZW0gaGFzaD1cIiNwcm9ibGVtcy90eXBlLzJcIj5XVEY8L01lbnVJdGVtPlxuXG5cdFx0XHRcdFx0PC9NZW51PlxuXHRcdFx0XHRcdDxWaWV3Q2hhbmdlciB2aWV3cz17W0dlbmVyYXRvcl19IGlkPXt0aGlzLnN0YXRlLnBhZ2V9IC8+XG5cdFx0PC9kaXY+XG5cdFx0XHRcdFxuXHRcdFx0XG5cblx0XHQ8L2Rpdj5cblxuXG5cdFx0KTtcblx0fVxufSk7XG5cblJlYWN0LnJlbmRlcig8QXBwLz4sZG9jdW1lbnQuYm9keSlcblxuIl19