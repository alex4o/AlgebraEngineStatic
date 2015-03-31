var QuadraticEquation = React.createClass({displayName: "QuadraticEquation",
    componentDidMount: function(){
        self = this

	},

	componentWillMount: function(){
        this.props.model.addres = "/gen/QuadraticEquation/"

		
    	this.props.model.data = checkStorageForDataOrReturnDefault({
			type : [50,50],
			up	: {low:1 ,high:10},
			down: {low:1 ,high:10}
		});

    },

    render: function () {


		var data = this.props.model.data

        return (
			React.createElement("div", {className: "form"}, 
				React.createElement("div", {className: "row scol", rel: "Вид"}, 
					"Цели ", React.createElement(RangeInput, {value: data, bind: "type", min: "0", max: "100"}), " Дробни"
				), 
				
				React.createElement(MinMaxInput, null), 

				React.createElement("div", {className: "row", rel: "Числител"}, 
					React.createElement("div", {className: "col"}, 
						"максимум ", React.createElement(NumberInput, {value: data.up, bind: "high"})
					), 
					React.createElement("div", {className: "col"}, 
						"минимум ", React.createElement(NumberInput, {value: data.up, bind: "low"})
					)
				), 
				
				React.createElement("div", {className: "row", rel: "Знаменател"}, 
					React.createElement("div", {className: "col"}, 
						"максимум ", React.createElement(NumberInput, {value: data.down, bind: "high"})
					), 
					React.createElement("div", {className: "col"}, 
							"минимум ", React.createElement(NumberInput, {value: data.down, bind: "low"})
					)
				)
			)
        );
    }
});
