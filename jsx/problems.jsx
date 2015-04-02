var Problems = React.createClass({
	getInitialState() {
		return {
		  list: [],
		  starlist: []
		};
	},
	componentDidMount: function () {
		self = this
	    superagent.get("/api/data/problems/").end(function(res){
	    	self.setState({
	    		list: JSON.parse(res.text); 
	    	});
	    })  
	},
	render() {
		return (
		
		<div>
			<h1>Генерирани задачи</h1>
			<div className="gen-list">
				<ProblemListItem/>
				<ProblemListItem/>
				<ProblemListItem/>

			</div>
		</div>
		);
	}
});

var ProblemListItem = React.createClass({
    render: function () {
        return (
            <div className="gen-item">
				<KaТeXitem problem="ax^2-bx+c"/>
				<span className="control">Любима</span>
				<span className="control">Изтрий</span>
			</div>
        );
    }
});

