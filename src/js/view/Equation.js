import React from 'react';
import Input from '../input';

import {Row,Button,Navbar,Grid,Col,Panel,DropdownButton} from 'react-bootstrap';


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
			<Row>
				<Panel header="Степен" >
					<Col md={12}>
						<Input.Number value={data} bind="pow"/>
					</Col>
				</Panel>

				<Panel header="Степен на скобите" >
					<Col md={12}>
						Максимална <Input.Number value={data} bind="powTerm"/>
					</Col>
				</Panel>

				<Panel header="Променлива" >
					<Col md={12}>
						<Input.String value={data} bind="let"/>
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
				<Panel header="Корени" >
					<Panel header="Вид" >
						<Col md={2} xs={1}>
							Цели
						</Col>
						<Col md={8} xs={10}>
							<Input.Range value={data.root} bind="type" min="0" max="100" />
						</Col>
						<Col md={2} xs={1}>
							Дробни
						</Col>
					</Panel>

					<Panel header="Числител" >
						<Col md={6}>
							максимум <Input.Number value={data.root.up} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.Number value={data.root.up} bind="low"/>
						</Col>
					</Panel>
					
					<Panel header="Знаменател" >
						<Col md={6}>
							максимум <Input.Number value={data.root.down} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.Number value={data.root.down} bind="low"/>
						</Col>
					</Panel>
				</Panel>
			</Row>
		);
    }
});
