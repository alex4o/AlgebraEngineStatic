var Problems = React.createClass({displayName: "Problems",
	getInitialState: function() {
		return {
		  list: [],
		  starlist: []
		};
	},
	componentDidMount: function () {
		self = this;
  		superagent.get("/api/data/problems/").query({token: sessionStorage.getItem("token")}).end(this.update)
	},
	update: function(res){
		this.setState({
			list: JSON.parse(res.text)
		});
	},
	render: function() {

		ListItems = this.state.list.map(function(item,index){
			return (React.createElement(ProblemListItem, {latex: item.t1}))
		})
		return (
		
		React.createElement("div", null, 
			React.createElement("h1", null, "Генерирани задачи"), 
			React.createElement("div", {className: "gen-list"}, 
				ListItems
			)
		)
		);
	}
});

var ProblemListItem = React.createClass({displayName: "ProblemListItem",
    render: function () {
        return (
            React.createElement("div", {className: "gen-item"}, 
				React.createElement(KaТeXitem, {problem: this.props.latex}), 
				React.createElement("span", {className: "control"}, "Любима"), 
				React.createElement("span", {className: "control"}, "Изтрий")
			)
        );
    }
});

