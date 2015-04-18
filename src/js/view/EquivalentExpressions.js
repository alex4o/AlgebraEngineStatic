import React from 'react';
import Input from '../input';
import {Row,Button,Navbar,Grid,Col,Panel,DropdownButton} from 'react-bootstrap';


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
			<Row>
				<Panel header="Степен" >
					<Col md={12}>
						Максимална <Input.Number value={data} bind="pow"/>
					</Col>
				</Panel>

				<Panel header="Променливи" >
					<Col md={12}>
						<Input.String value={data} bind="let"/>
					</Col>
				</Panel>

				<Panel header="Брой елементи в скобите" >
					<Col md={6}>
						Минимум <Input.Number value={data.Letters} bind="min"/>
					</Col>
					<Col md={6}>
						Максимум <Input.Number value={data.Letters} bind="max"/>
					</Col>
				</Panel>


				<Panel header="Брой на скобите" >
					<Col md={6}>
						Минимум <Input.Number value={data.Term} bind="min"/>
					</Col>
					<Col md={6}>
						Максимум <Input.Number value={data.Term} bind="max"/>
					</Col>
				</Panel>

				<Panel header="Коефициенти пред променливите" >
					<Panel header="Вид" >
					<Col md={2} xs={1}>
						Цели
					</Col>
					<Col md={8} xs={10}>
						<Input.Range value={data.coef} bind="type" min="0" max="100" />
					</Col>
					<Col md={2} xs={1}>
						Дробни
					</Col>
					</Panel>
						
					<Panel header="Числител" >
						<Col md={6}>
							максимум <Input.Number value={data.coef.up} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.Number value={data.coef.up} bind="low"/>
						</Col>
					</Panel>
					
					<Panel header="Знаменател" >
						<Col md={6}>
							максимум <Input.Number value={data.coef.down} bind="high"/>
						</Col>
						<Col md={6}>
								минимум <Input.Number value={data.coef.down} bind="low"/>
						</Col>
					</Panel>
				</Panel>
				
				<Panel header="Коефициенти пред скобите" >
					<Panel header="Вид " >
						<Col md={2} xs={1}>
							Цели
						</Col>
						<Col md={8} xs={10}>
							<Input.Range value={data.tcoef} bind="type" min="0" max="100" />
						</Col>
						<Col md={2} xs={1}>
							Дробни
						</Col>
					</Panel>
						
					<Panel header="Числител" >
						<Col md={6}>
							максимум <Input.Number value={data.tcoef.up} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.Number value={data.tcoef.up} bind="low"/>
						</Col>
					</Panel>
					
					<Panel header="Знаменател" >
						<Col md={6}>
							максимум <Input.Number value={data.tcoef.down} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.Number value={data.tcoef.down} bind="low"/>
						</Col>
					</Panel>
				</Panel>

			</Row>
		);
	}
});
