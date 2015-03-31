var Equation = React.createClass({displayName: "Equation",
    componentDidMount: function(){
        self = this

	},

	componentWillMount: function(){
        this.props.model.addres = "/gen/Equation/"

		
    	this.props.model.data = checkStorageForDataOrReturnDefault({
			pow : 2,
			powTerm: 2,
			let:"x",
			root:
			{
				type : [50,50],
				up	: {low:1 ,high:7},
				down: {low:1 ,high:10}
			},
			Term:
			{
				min:1,
				max:3
			}
			
		});

    },

    render: function () {


		var data = this.props.model.data

        return (
			React.createElement("div", {className: "form"}, 
				React.createElement("div", {className: "row scol", rel: "Степен"}, 
						React.createElement(NumberInput, {value: data, bind: "pow"})
				), 

				React.createElement("div", {className: "row scol", rel: "Степен на скобите"}, 
						"Максимална ", React.createElement(NumberInput, {value: data, bind: "powTerm"})
				), 

				React.createElement("div", {className: "row scol", rel: "Променлива"}, 
						React.createElement(StringInput, {value: data, bind: "let"})
				), 

				React.createElement("div", {className: "row", rel: "Брой на скобите"}, 
					React.createElement("div", {className: "col"}, 
						"Минимум ", React.createElement(NumberInput, {value: data.Term, bind: "min"})
					), 
					React.createElement("div", {className: "col"}, 
						"Максимум ", React.createElement(NumberInput, {value: data.Term, bind: "max"})
					)
				), 
				React.createElement("div", {className: "row form sform", rel: "Корени"}, 
					React.createElement("div", {className: "row scol", rel: "Вид"}, 
						"Цели ", React.createElement(RangeInput, {value: data.root, bind: "type", min: "0", max: "100"}), " Дробни"
					), 

					React.createElement("div", {className: "row", rel: "Числител"}, 
						React.createElement("div", {className: "col"}, 
							"максимум ", React.createElement(NumberInput, {value: data.root.up, bind: "high"})
						), 
						React.createElement("div", {className: "col"}, 
							"минимум ", React.createElement(NumberInput, {value: data.root.up, bind: "low"})
						)
					), 
					
					React.createElement("div", {className: "row", rel: "Знаменател"}, 
						React.createElement("div", {className: "col"}, 
							"максимум ", React.createElement(NumberInput, {value: data.root.down, bind: "high"})
						), 
						React.createElement("div", {className: "col"}, 
								"минимум ", React.createElement(NumberInput, {value: data.root.down, bind: "low"})
						)
					)
				)
			)
        );
    }
});
