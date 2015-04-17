import React from 'react';

module.exports = React.createClass({
	componentDidMount: function(){
		self = this

	},

	componentWillMount: function(){
		this.props.model.addres = "/gen/Equation/"

		
		this.props.model.data = this.props.check({
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
			<div className="form">
				<div className="row scol" rel="Степен" >
						<NumberInput value={data} bind="pow"/>
				</div>

				<div className="row scol" rel="Степен на скобите" >
						Максимална <NumberInput value={data} bind="powTerm"/>
				</div>

				<div className="row scol" rel="Променлива" >
						<StringInput value={data} bind="let"/>
				</div>

				<div className="row" rel="Брой на скобите" >
					<div className="col" >
						Минимум <NumberInput value={data.Term} bind="min"/>
					</div>
					<div className="col" >
						Максимум <NumberInput value={data.Term} bind="max"/>
					</div>
				</div>
				<div className="row form sform" rel="Корени" >
					<div className="row scol"  rel="Вид" >
						Цели <RangeInput value={data.root} bind="type" min="0" max="100" /> Дробни
					</div>

					<div className="row" rel="Числител" >
						<div className="col" >
							максимум <NumberInput value={data.root.up} bind="high"/>
						</div>
						<div className="col" >
							минимум <NumberInput value={data.root.up} bind="low"/>
						</div>
					</div>
					
					<div className="row" rel="Знаменател" >
						<div className="col" >
							максимум <NumberInput value={data.root.down} bind="high"/>
						</div>
						<div className="col" >
							минимум <NumberInput value={data.root.down} bind="low"/>
						</div>
					</div>
				</div>
			</div>
		);
    }
});
