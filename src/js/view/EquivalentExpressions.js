import React from 'react';
import Input from '../input';


module.exports = React.createClass({
	componentDidMount: function(){


	},
	componentWillMount: function () {
		this.props.model.addres = "/gen/EquivalentExpression/"

		this.props.model.data = this.props.check({
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
			<div className="form">
				<div className="row scol" rel="Степен" >
						Максимална <Input.Number value={data} bind="pow"/>
				</div>

				<div className="row scol" rel="Променливи" >
						<Input.String value={data} bind="let"/>
				</div>

				<div className="row" rel="Брой елементи в скобите" >
					<div className="col" >
						Минимум <Input.Number value={data.Letters} bind="min"/>
					</div>
					<div className="col" >
						Максимум <Input.Number value={data.Letters} bind="max"/>
					</div>
				</div>


				<div className="row" rel="Брой на скобите" >
					<div className="col" >
						Минимум <Input.Number value={data.Term} bind="min"/>
					</div>
					<div className="col" >
						Максимум <Input.Number value={data.Term} bind="max"/>
					</div>
				</div>

				<div className="row form sform" rel="Коефициенти пред променливите" >
					<div className="row scol"  rel="Вид" >
						Цели <Input.Range value={data.coef} bind="type" min="0" max="100" /> Дробни
					</div>
						
					<div className="row" rel="Числител" >
						<div className="col" >
							максимум <Input.Number value={data.coef.up} bind="high"/>
						</div>
						<div className="col" >
							минимум <Input.Number value={data.coef.up} bind="low"/>
						</div>
					</div>
					
					<div className="row" rel="Знаменател" >
						<div className="col" >
							максимум <Input.Number value={data.coef.down} bind="high"/>
						</div>
						<div className="col" >
								минимум <Input.Number value={data.coef.down} bind="low"/>
						</div>
					</div>
				</div>
				
				<div className="row form sform" rel="Коефициенти пред скобите" >
					<div className="row scol"  rel="Вид " >
						Цели <Input.Range value={data.tcoef} bind="type" min="0" max="100" /> Дробни
					</div>
						
					<div className="row" rel="Числител" >
						<div className="col" >
							максимум <Input.Number value={data.tcoef.up} bind="high"/>
						</div>
						<div className="col" >
							минимум <Input.Number value={data.tcoef.up} bind="low"/>
						</div>
					</div>
					
					<div className="row" rel="Знаменател" >
						<div className="col" >
							максимум <Input.Number value={data.tcoef.down} bind="high"/>
						</div>
						<div className="col" >
								минимум <Input.Number value={data.tcoef.down} bind="low"/>
						</div>
					</div>
				</div>

			</div>
		);
	}
});
