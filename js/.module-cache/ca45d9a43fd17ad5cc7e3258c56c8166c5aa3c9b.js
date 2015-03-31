
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
		routie('0/:id', this.changeView);
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
var Home = React.createClass({displayName: "Home",

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
						React.createElement(MenuItem, {hash: "#1/0"}, "Tъждествени изрази"), 

						React.createElement(MenuItem, {hash: "#0/0"}, "Tъждествени изрази"), 
						React.createElement(MenuItem, {hash: "#0/1"}, "Уравнения"), 
						React.createElement(MenuItem, {hash: "#0/2"}, "WTF")

					), 
					React.createElement(ViewChanger, {views: [Generator,], id: this.state.page})
		)
				
			

		)


		);
	}
});

React.render(React.createElement(App, null),document.body)


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZWQuanMiLCJzb3VyY2VzIjpbbnVsbF0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUU7QUFDRixJQUFJLEtBQUssR0FBRztDQUNYLE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQyxJQUFJLEVBQUU7O0VBRUw7Q0FDRCxNQUFNLEVBQUUsRUFBRTtDQUNWLElBQUksRUFBRTtFQUNMLElBQUksRUFBRSxFQUFFO0VBQ1IsSUFBSSxFQUFFLEVBQUU7RUFDUjtBQUNGLENBQUMsR0FBRyxFQUFFOztFQUVKO0FBQ0YsQ0FBQzs7QUFFRCxTQUFTLGtDQUFrQyxDQUFDLEdBQUcsQ0FBQztDQUMvQyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ3pFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7RUFDOUMsSUFBSTtFQUNKLE9BQU8sR0FBRztFQUNWO0FBQ0YsQ0FBQzs7QUFFRCxxQkFBcUI7QUFDckIsSUFBSSxtQ0FBbUMsNkJBQUE7QUFDdkMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLFNBQVMsRUFBRSxTQUFTLENBQUM7O0VBRWhELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtFQUM1QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7RUFDOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ2xELEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFD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QyxFQUFBLEVBQUUsQ0FBQyxTQUFVLENBQUEsRUFBQTtJQUNoQixvQkFBQyxJQUFJLEVBQUEsQ0FBQSxDQUFDLEdBQUEsRUFBRyxDQUFDLE1BQU8sQ0FBQSxFQUFBO0FBQ3JCLE1BQU0sb0JBQUMsUUFBUSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyxNQUFPLENBQUEsRUFBQSxvQkFBNkIsQ0FBQSxFQUFBOztNQUVuRCxvQkFBQyxRQUFRLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQU8sQ0FBQSxFQUFBLG9CQUE2QixDQUFBLEVBQUE7TUFDbkQsb0JBQUMsUUFBUSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBQyxNQUFPLENBQUEsRUFBQSxXQUFvQixDQUFBLEVBQUE7QUFDaEQsTUFBTSxvQkFBQyxRQUFRLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLE1BQU8sQ0FBQSxFQUFBLEtBQWMsQ0FBQTs7S0FFOUIsQ0FBQSxFQUFBO0tBQ1Asb0JBQUMsV0FBVyxFQUFBLENBQUEsQ0FBQyxLQUFBLEVBQUssQ0FBRSxDQUFDLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBQSxFQUFFLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUEsQ0FBRyxDQUFBO0FBQzlELEVBQVEsQ0FBQTtBQUNSO0FBQ0E7O0FBRUEsRUFBUSxDQUFBO0FBQ1I7O0lBRUk7RUFDRjtBQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQUMsR0FBRyxFQUFBLElBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qXG52YXIgZGF0YSA9IHtcblx0ZnJhY3Rpb24gICAgOiA1MCxcblx0bmF0dXJhbFx0XHQ6IDUwLFxuXHRpcnJhdGlvbmFsXHQ6IDAsXG5cdHVwXHQ6IHtsb3c6MSAsaGlnaDoxMH0sXG5cdGRvd246IHtsb3c6MSAsaGlnaDoxMH1cbn1cbiovXG52YXIgbW9kZWwgPSB7XG5cdHZpZXdfaWQ6IDAsXG5cdGRhdGE6IHtcblxuXHR9LFxuXHRhZGRyZXM6IFwiXCIsXG5cdHVzZXI6IHtcblx0XHRuYW1lOiBcIlwiLFxuXHRcdHBhc3M6IFwiXCJcblx0fSxcblx0cmVzIDp7XG5cblx0fVxufVxuXG5mdW5jdGlvbiBjaGVja1N0b3JhZ2VGb3JEYXRhT3JSZXR1cm5EZWZhdWx0KGRlZil7XG5cdGlmKGxvY2FsU3RvcmFnZVttb2RlbC5hZGRyZXNdICE9IG51bGwgJiYgbG9jYWxTdG9yYWdlW21vZGVsLmFkZHJlc10gIT0gXCJcIil7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlW21vZGVsLmFkZHJlc10pO1xuXHR9ZWxzZXtcblx0XHRyZXR1cm4gZGVmXG5cdH1cbn1cblxuLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgTWF0aENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Y29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKHByZXZQcm9wcywgcHJldlN0YXRlKXtcblxuXHRcdHZhciBwcm9ibGVtID0gdGhpcy5yZWZzLnByb2JsZW0uZ2V0RE9NTm9kZSgpXG5cdFx0dmFyIHNvbHV0aW9uID0gdGhpcy5yZWZzLnNvbHV0aW9uLmdldERPTU5vZGUoKVxuXHRcdGthdGV4LnJlbmRlcih0aGlzLnByb3BzLm1hdGhbMF0ucHJvYmxlbSxwcm9ibGVtKVxuXHRcdGthdGV4LnJlbmRlcih0aGlzLnByb3BzLm1hdGhbMF0uc29sdXRpb24sc29sdXRpb24pXG5cdFx0XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlZnMucHJvYmxlbS5nZXRET01Ob2RlKCkuaW5uZXJIVE1MID0gXCLQl9CwINC00LAg0YHRitC30LTQsNC00LXRgtC1INC30LDQtNCw0YfQsCDQvdCw0YLQuNGB0L3QtdGC0LUg0LPQtdC90LXRgNC40YDQsNC5XCJcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGlkPVwiTWF0aENvbnRhaW5lclwiPlxuXHRcdFx0XHQ8c3BhbiBpZD1cInJlc3VsdFwiIHJlZj1cInByb2JsZW1cIj48L3NwYW4+XG5cdFx0XHRcdDxzcGFuIHN0eWxlPXt7ZGlzcGxheTp0aGlzLnByb3BzLnNvbHV0aW9uVmlzYWJsZSA/IFwiYmxvY2tcIiA6IFwibm9uZVwifX0gcmVmPVwic29sdXRpb25cIj48L3NwYW4+XG5cdFx0XHQ8L2Rpdj4pXG5cdH1cbn0pXG5cblxudmFyIElucHV0Q29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHR2aWV3czogW0VxdWl2YWxlbnRFeHByZXNzaW9ucyxFcXVhdGlvbixRdWFkcmF0aWNFcXVhdGlvbl0sXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge3ZpZXc6IFwiZGl2XCJ9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKHRoaXMudmlld3MpXG5cdFx0cm91dGllKCcwLzppZCcsIHRoaXMuY2hhbmdlVmlldyk7XG5cdH0sXG5cdGNoYW5nZVZpZXc6IGZ1bmN0aW9uKGlkKXtcblx0XHRpZihpZCA8IHRoaXMudmlld3MubGVuZ3RoKXtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe3ZpZXc6IHRoaXMudmlld3NbaWRdfSlcblx0XHRcdG1vZGVsLnZpZXdfaWQgPSBpZCB8IDA7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGF0YSA9IHRoaXMucHJvcHMubW9kZWwuZGF0YVxuXHRcdHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudCh0aGlzLnN0YXRlLnZpZXcse21vZGVsOm1vZGVsfSkpO1xuXHR9XG59KTtcblxudmFyIEth0KJlWGl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGNvbXBvbmVudERpZE1vdW50OiAgZnVuY3Rpb24oKXtcblxuXHRcdC8vY29uc29sZS5sb2codGhpcy5wcm9wcy5wcm9ibGVtKVxuXG5cdFx0dmFyIHNoaXQgPSB0aGlzLnJlZnMuc2hpdC5nZXRET01Ob2RlKClcblx0XHRrYXRleC5yZW5kZXIodGhpcy5wcm9wcy5wcm9ibGVtLHNoaXQpXG5cblxuXHR9LFxuXHRjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcywgcHJldlN0YXRlKXtcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMucHJvYmxlbSlcblxuXHRcdHZhciBzaGl0ID0gdGhpcy5yZWZzLnNoaXQuZ2V0RE9NTm9kZSgpXG5cdFx0a2F0ZXgucmVuZGVyKHRoaXMucHJvcHMucHJvYmxlbSxzaGl0KVxuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuKDxzcGFuICByZWY9XCJzaGl0XCI+PC9zcGFuPilcblx0fVxufSlcblxudmFyIFByaW50TGlzdENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Y29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbigpe1xuXHRcdG9mc2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmNob3JcIikub2Zmc2V0VG9wO1xuXHRcdHNjcm9sbFRvKDAsb2ZzZXQpXG5cdH0sXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZTogZnVuY3Rpb24obmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcblx0XHRyZXR1cm4gbmV4dFByb3BzLnJlc1swXSAhPT0gdGhpcy5wcm9wcy5yZXNbMF07XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHByb2JsZW1zID0gdGhpcy5wcm9wcy5yZXMubWFwKGZ1bmN0aW9uKHJlc3VsdCxpdGVyKXtcblx0XHRcdC8vY29uc29sZS5sb2cocmVzdWx0KVxuXHRcdFx0cmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cIml0ZW1zXCI+PHNwYW4gY2xhc3NOYW1lPVwibnVtXCI+e2l0ZXIrMX08L3NwYW4+PEth0KJlWGl0ZW0gcHJvYmxlbT17cmVzdWx0LnByb2JsZW19IC8+PC9kaXY+KVxuXHRcdH0pXG5cblx0XHRzb2x1dGlvbiA9IHRoaXMucHJvcHMucmVzLm1hcChmdW5jdGlvbihyZXN1bHQsaXRlcil7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHJlc3VsdClcblx0XHRcdHJldHVybiAoPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiPjxzcGFuIGNsYXNzTmFtZT1cIm51bVwiPntpdGVyKzF9PC9zcGFuPjxLYdCiZVhpdGVtIHByb2JsZW09e3Jlc3VsdC5zb2x1dGlvbn0gLz48L2Rpdj4pXG5cdFx0fSlcblx0XHR2YXIgc3QgPSB7fVxuXHRcdGlmKHRoaXMucHJvcHMucmVzLmxlbmd0aCA+IDApe1xuXHRcdFx0c3RbXCJkaXNwbGF5XCJdID0gXCJibG9ja1wiXG5cblxuXHRcdH1lbHNle1xuXHRcdFx0c3RbXCJkaXNwbGF5XCJdID0gXCJub25lXCJcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXG5cdFx0XHQ8ZGl2IGlkPVwiYW5jaG9yXCIgc3R5bGU9e3N0fSBjbGFzc05hbWU9XCJsaXN0XCI+XG5cdFx0XHRcdNCX0LDQtNCw0YfQuDpcblx0XHRcdFx0e3Byb2JsZW1zfVxuXHRcdFx0XHQ8YnIgLz5cblx0XHRcdFx00J7RgtCz0L7QstC+0YDQuDpcblx0XHRcdFx0e3Byb2JsZW1zfVxuXHRcdFx0PC9kaXY+XG5cdFx0KVxuXHR9XG59KTtcblxuXG52YXIgTWVudUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RlZDogbW9kZWwudmlld19pZFxuXHRcdH07XG5cdH0sXG5cdGNoYW5nZTogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdGNvbnNvbGUubG9nKGluZGV4KVxuXHRcdHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkOiBpbmRleH0pXG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIGxpc3QgPSB0aGlzLnByb3BzLml0ZW1zLm1hcChmdW5jdGlvbihpdGVtLGluZGV4KXtcblx0XHRcdHZhciBzdHlsZSA9IFwiXCJcblx0XHRcdGlmKHNlbGYuc3RhdGUuc2VsZWN0ZWQgPT0gaW5kZXgpe1xuXHRcdFx0XHRzdHlsZSA9IFwic2VsZWN0ZWRcIlxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIDxhIGNsYXNzTmFtZT17c3R5bGV9IGhyZWY9e2l0ZW0uaHJlZn0gb25DbGljaz17c2VsZi5jaGFuZ2UuYmluZChzZWxmLGluZGV4KX0+e2l0ZW0udGV4dH08L2E+XG5cdFx0fSlcblx0XHRyZXR1cm4gKDxkaXY+e2xpc3R9PC9kaXY+KVxuXHR9XG59KSBcblxudmFyIFZpZXdDaGFuZ2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nKHRoaXMucHJvcHMpXG5cdFx0aWYodGhpcy5wcm9wcy5pZCA8IHRoaXMucHJvcHMudmlld3MubGVuZ3RoKXtcblx0XHRcdHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudCh0aGlzLnByb3BzLnZpZXdzW3RoaXMucHJvcHMuaWRdLHttb2RlbDptb2RlbH0pKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiA8ZGl2PjwvZGl2PlxuXHRcdH1cblx0fVxufSk7XG5cblxudmFyIEdlbmVyYXRvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB7XG5cdFx0XHRtYXRoOiBbe3Byb2JsZW06IFwiXCIsIHNvbHV0aW9uOiBcIlwifV0sXG5cdFx0XHRzdjogZmFsc2UsXG5cdFx0XHRsaXN0OiBbXVxuXHRcdH1cblx0fSxcblx0c3VibWl0OiBmdW5jdGlvbigpe1xuXHRcdHNlbGYgPSB0aGlzXG5cdFx0bG9jYWxTdG9yYWdlW21vZGVsLmFkZHJlc10gPSBKU09OLnN0cmluZ2lmeShtb2RlbC5kYXRhKVxuXHRcdHN1cGVyYWdlbnQucG9zdChcIi9hcGlcIiArIG1vZGVsLmFkZHJlcykuc2VuZChtb2RlbC5kYXRhKS5zZW5kKHtjb3I6MX0pLmVuZChmdW5jdGlvbihyZXMpe1xuXHRcdFx0aWYocmVzLnN0YXR1cyA9PSAyMDApe1xuXHRcdFx0XHRtb2RlbC5yZXMgPSBKU09OLnBhcnNlKHJlcy50ZXh0KVxuXHRcdFx0XHRzZWxmLnNldFN0YXRlKHttYXRoOiBtb2RlbC5yZXN9KVxuXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0c2VsZi5zZXRTdGF0ZSh7bWF0aDoge3Byb2JsZW06IFwiZXJyb3JcIixzb2x1dGlvbjpcIiAtLS0gXCJ9IH0pXG5cblx0XHRcdFx0Ly9rYXRleC5yZW5kZXIoXCJlcnJvclwiLHByb2JsZW0pXG5cblxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdC8vYWxlcnQobWF0aClcblx0XHQvL2NvbnNvbGUubG9nKG1hdGgpXG5cdFx0XG5cdFx0Ly90aGlzLnNldFN0YXRlKHttYXRoOiBtYXRofSlcblx0fSxcblx0c3VibWl0X21vcmU6IGZ1bmN0aW9uKCl7XG5cdFx0c2VsZiA9IHRoaXNcblx0XHRsb2NhbFN0b3JhZ2VbbW9kZWwuYWRkcmVzXSA9IEpTT04uc3RyaW5naWZ5KG1vZGVsLmRhdGEpXG5cdFx0XG5cdFx0XG5cdFx0c3VwZXJhZ2VudC5wb3N0KFwiL2FwaVwiICsgbW9kZWwuYWRkcmVzKS5zZW5kKG1vZGVsLmRhdGEpLnNlbmQoe2NvcjoxMH0pLmVuZChmdW5jdGlvbihyZXMpe1xuXHRcdFx0aWYocmVzLnN0YXR1cyA9PSAyMDApe1xuXHRcdFx0XHRtb2RlbC5yZXMgPSBKU09OLnBhcnNlKHJlcy50ZXh0KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhtb2RlbC5yZXMpXG5cblx0XHRcdFx0c2VsZi5zZXRTdGF0ZSh7bGlzdDogbW9kZWwucmVzfSlcblx0XHRcdFx0Y29uc29sZS5sb2cob2ZzZXQpXG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHQvL2thdGV4LnJlbmRlcihcImVycm9yXCIscHJvYmxlbSlcblxuXG5cdFx0XHR9XG5cdFx0fSk7XG5cblxuXHRcdC8vYWxlcnQobWF0aClcblx0XHQvL2NvbnNvbGUubG9nKG1hdGgpXG5cdH0sXG5cdHNob3c6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7c3Y6ICF0aGlzLnN0YXRlLnN2fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXG5cdFx0XHQ8TWF0aENvbXBvbmVudCBtYXRoPXt0aGlzLnN0YXRlLm1hdGh9IHNvbHV0aW9uVmlzYWJsZT17dGhpcy5zdGF0ZS5zdn0vPlxuXG5cdFx0XHQ8ZGl2IGlkPVwiaW5uZXItY29udGVudFwiID5cblx0XHRcdFx0XG5cdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIG9uQ2xpY2s9e3RoaXMuc3VibWl0fT7Qk9C10L3QtdGA0LjRgNCw0Lk8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwibWVudS1pdGVtXCIgb25DbGljaz17dGhpcy5zdWJtaXRfbW9yZX0+0JPQtdC90LXRgNC40YDQsNC5INC90Y/QutC+0LvQutC+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT1cIm1lbnUtaXRlbVwiIG9uQ2xpY2s9e3RoaXMuc2hvd30+0J/QvtC60LDQttC4L9GB0LrRgNC40Lkg0L7RgtCz0L7QstC+0YDQuNGC0LU8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQ8ZGl2IGlkPVwiSW5wdXRDb250YWluZXJcIj5cblx0XHRcdFx0XHRcdDxJbnB1dENvbXBvbmVudCBtb2RlbD17bW9kZWx9Lz5cblx0XHRcdFx0XHQ8L2Rpdj5cblxuXG5cdFx0XHRcdDwvZGl2PlxuXG5cdFx0XHRcdFxuXG5cdFx0XHQ8L2Rpdj5cblx0XHRcdFxuXHRcdFx0PFByaW50TGlzdENvbXBvbmVudCByZXM9e3RoaXMuc3RhdGUubGlzdH0vPlxuXHRcdFx0PC9kaXY+XG5cblx0XHQpO1xuXHR9XG59KTtcblxudmFyIE1lbnUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHZpc2libGU6IGZhbHNlXHRcblx0XHR9O1xuXHR9LFxuXG5cdHNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlOiB0cnVlIH0pO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XG5cdH0sXG5cblx0aGlkZTogZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdDxkaXYgY2xhc3NOYW1lPVwiXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17XCJzbGlkZS1tZW51LVwiKyh0aGlzLnN0YXRlLnZpc2libGUgPyBcInZpc2libGUgXCIgOiBcIlwiKSsgXCIgc2xpZGUtbWVudVwifT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj4pO1xuXHR9XG59KTtcblxudmFyIE1lbnVJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRuYXZpZ2F0ZTogZnVuY3Rpb24oaGFzaCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaDtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInNsaWRlLW1lbnUtaXRlbVwiIG9uQ2xpY2s9e3RoaXMubmF2aWdhdGUuYmluZCh0aGlzLCB0aGlzLnByb3BzLmhhc2gpfT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj47XG5cdH1cbn0pO1xudmFyIEhvbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbn0pXG5cbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cGFnZTogMCxcblx0XHR9XG5cdH0sXG5cdG9wZW5NZW51OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMucmVmcy5tZW51LnNob3coKVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKXtcblx0XHRzZWxmID0gdGhpc1xuXHRcdHJvdXRpZShcIjppZFwiLGZ1bmN0aW9uKGlkKXtcblx0XHRcdHNlbGYuc2V0U3RhdGUoe3BhZ2U6IGlkIHwgMH0pXG5cdFx0fSk7XG5cblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICg8ZGl2PlxuXG5cdFx0PG5hdj5cblx0XHRcdDxkaXYgaWQ9XCJzZWxlY3RcIj5cblx0XHRcdFx0PGJ1dHRvbiBvbkNsaWNrPXt0aGlzLm9wZW5NZW51fT5zaG93PC9idXR0b24+XG5cdFx0XHRcdDxsb2dvPlxuXHRcdFx0XHRcdNCc0LDRgtC10LzQsNGC0LjQutCwINC30LAg0LLRgdC40YfQutC4XG5cdFx0XHRcdDwvbG9nbz5cblx0XHRcdFx0PGRpdiBpZD1cInVzZXJcIiBzdHlsZT17e2Zsb2F0OlwicmlnaHRcIn19PlxuXHRcdFx0XHRcdDxVc2VyRm9ybSBkYXRhPXttb2RlbC51c2VyfS8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cblx0XHQ8L25hdj5cblxuXG5cdFx0PGRpdiBpZD1cImNvbnRlbnRcIj5cblx0XHRcdFx0PE1lbnUgcmVmPVwibWVudVwiPlxuXHRcdFx0XHRcdFx0PE1lbnVJdGVtIGhhc2g9XCIjMS8wXCI+VNGK0LbQtNC10YHRgtCy0LXQvdC4INC40LfRgNCw0LfQuDwvTWVudUl0ZW0+XG5cblx0XHRcdFx0XHRcdDxNZW51SXRlbSBoYXNoPVwiIzAvMFwiPlTRitC20LTQtdGB0YLQstC10L3QuCDQuNC30YDQsNC30Lg8L01lbnVJdGVtPlxuXHRcdFx0XHRcdFx0PE1lbnVJdGVtIGhhc2g9XCIjMC8xXCI+0KPRgNCw0LLQvdC10L3QuNGPPC9NZW51SXRlbT5cblx0XHRcdFx0XHRcdDxNZW51SXRlbSBoYXNoPVwiIzAvMlwiPldURjwvTWVudUl0ZW0+XG5cblx0XHRcdFx0XHQ8L01lbnU+XG5cdFx0XHRcdFx0PFZpZXdDaGFuZ2VyIHZpZXdzPXtbR2VuZXJhdG9yLF19IGlkPXt0aGlzLnN0YXRlLnBhZ2V9IC8+XG5cdFx0PC9kaXY+XG5cdFx0XHRcdFxuXHRcdFx0XG5cblx0XHQ8L2Rpdj5cblxuXG5cdFx0KTtcblx0fVxufSk7XG5cblJlYWN0LnJlbmRlcig8QXBwLz4sZG9jdW1lbnQuYm9keSlcblxuIl19