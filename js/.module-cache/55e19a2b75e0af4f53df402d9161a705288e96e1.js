var EquivalentExpressions = React.createClass({displayName: "EquivalentExpressions",
	componentDidMount: function(){


	},
	componentWillMount: function () {
		this.props.model.addres = "/gen/EquivalentExpression/"

		this.props.model.data = checkStorageForDataOrReturnDefault({
			pow:2,
			let:"xyz",
			Letters:
			{
				min:2,
				max:3
			},
			Term:
			{
				min:1,
				max:3
			},
			coef:
			{			
				type : [50,50],
				up	: {low:1 ,high:10},
				down: {low:1 ,high:10}
			},
			tcoef:
			{
				type : [50,50],
				up	: {low:1 ,high:7},
				down: {low:1 ,high:10}
			}
		})
	},
	render: function () {

		var data = this.props.model.data

		return (
			React.createElement("div", {className: "form"}, 
				React.createElement("div", {className: "row scol", rel: "Степен"}, 
						"Максимална ", React.createElement(NumberInput, {value: data, bind: "pow"})
				), 

				React.createElement("div", {className: "row scol", rel: "Променливи"}, 
						React.createElement(StringInput, {value: data, bind: "let"})
				), 

				React.createElement("div", {className: "row", rel: "Брой елементи в скобите"}, 
					React.createElement("div", {className: "col"}, 
						"Минимум ", React.createElement(NumberInput, {value: data.Letters, bind: "min"})
					), 
					React.createElement("div", {className: "col"}, 
						"Максимум ", React.createElement(NumberInput, {value: data.Letters, bind: "max"})
					)
				), 


				React.createElement("div", {className: "row", rel: "Брой на скобите"}, 
					React.createElement("div", {className: "col"}, 
						"Минимум ", React.createElement(NumberInput, {value: data.Term, bind: "min"})
					), 
					React.createElement("div", {className: "col"}, 
						"Максимум ", React.createElement(NumberInput, {value: data.Term, bind: "max"})
					)
				), 

				React.createElement("div", {className: "row form sform", rel: "Коефициенти пред променливите"}, 
					React.createElement("div", {className: "row scol", rel: "Вид"}, 
						"Цели ", React.createElement(RangeInput, {value: data.coef, bind: "type", min: "0", max: "100"}), " Дробни"
					), 
						
					React.createElement("div", {className: "row", rel: "Числител"}, 
						React.createElement("div", {className: "col"}, 
							"максимум ", React.createElement(NumberInput, {value: data.coef.up, bind: "high"})
						), 
						React.createElement("div", {className: "col"}, 
							"минимум ", React.createElement(NumberInput, {value: data.coef.up, bind: "low"})
						)
					), 
					
					React.createElement("div", {className: "row", rel: "Знаменател"}, 
						React.createElement("div", {className: "col"}, 
							"максимум ", React.createElement(NumberInput, {value: data.coef.down, bind: "high"})
						), 
						React.createElement("div", {className: "col"}, 
								"минимум ", React.createElement(NumberInput, {value: data.coef.down, bind: "low"})
						)
					)
				), 
				
				React.createElement("div", {className: "row form sform", rel: "Коефициенти пред скобите"}, 
					React.createElement("div", {className: "row scol", rel: "Вид "}, 
						"Цели ", React.createElement(RangeInput, {value: data.tcoef, bind: "type", min: "0", max: "100"}), " Дробни"
					), 
						
					React.createElement("div", {className: "row", rel: "Числител"}, 
						React.createElement("div", {className: "col"}, 
							"максимум ", React.createElement(NumberInput, {value: data.tcoef.up, bind: "high"})
						), 
						React.createElement("div", {className: "col"}, 
							"минимум ", React.createElement(NumberInput, {value: data.tcoef.up, bind: "low"})
						)
					), 
					
					React.createElement("div", {className: "row", rel: "Знаменател"}, 
						React.createElement("div", {className: "col"}, 
							"максимум ", React.createElement(NumberInput, {value: data.tcoef.down, bind: "high"})
						), 
						React.createElement("div", {className: "col"}, 
								"минимум ", React.createElement(NumberInput, {value: data.tcoef.down, bind: "low"})
						)
					)
				)

			)
		);
	}
});
