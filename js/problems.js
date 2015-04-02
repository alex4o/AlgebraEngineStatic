var Problems = React.createClass({displayName: "Problems",
	getInitialState:function() {
		return {
		  list: [],
		  starlist: []
		};
	},
	componentDidMount: function () {
		self = this
	    superagent.get("/api/data/problems/").end(function(res){
	    	self.setState({
	    		list: JSON.parse(res.text)
	    	});
	    })  
	},
	render:function() {
		return (
		
		React.createElement("div", null, 
			React.createElement("h1", null, "Генерирани задачи"), 
			React.createElement("div", {className: "gen-list"}, 
				React.createElement(ProblemListItem, null), 
				React.createElement(ProblemListItem, null), 
				React.createElement(ProblemListItem, null)

			)
		)
		);
	}
});

var ProblemListItem = React.createClass({displayName: "ProblemListItem",
    render: function () {
        return (
            React.createElement("div", {className: "gen-item"}, 
				React.createElement(KaТeXitem, {problem: "ax^2-bx+c"}), 
				React.createElement("span", {className: "control"}, "Любима"), 
				React.createElement("span", {className: "control"}, "Изтрий")
			)
        );
    }
});

