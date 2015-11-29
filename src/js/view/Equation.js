import React from 'react';
import Input from '../input';

import {Row,Button,Grid,Col,Panel,DropdownButton} from 'react-bootstrap';


export default class Equation extends React.Component
{
	componentDidMount(){

	}

	componentWillMount(){
		this.props.onChange("/gen/Equation/");
		this.default = {
			pow : 2,
			powTerm: 2,
			let:"x",
			type: 0,
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
		}
		this.props.check(this.default);

		let {numberTransform,charCheck} = this.props.validator

		this.numTrans = numberTransform;
		this.charCheck = charCheck;

	}

	render() {


		let data = this.props.setting
		if(Object.keys(this.props.setting).length == 0){
			data = this.default
		}
		return (
			<Row>
				<Col md={12} lg={12}>

				<Panel header="Решения">
					<Col md={12}>
						<Input.RadioList 
							value={data} 
							bind="type" 
							options={
								[
									{key:0,value:"Нормално"},
									{key:1,value:"Няма решение"},
									{key:2,value:"Всяко X е решение"}									
								]}
							default={data.type}/>
					</Col>
				</Panel>
				</Col>


				<Col md={6} lg={6}>
					<Panel header="Степен" >
						<Input.CustomText transform={this.numTrans} value={data} bind="pow"/>
					</Panel>
				</Col>

				<Col md={6} lg={6}>
					<Panel header="Променлива" >
						<Input.CustomText transform={this.charCheck} value={data} bind="let"/>
					</Panel>
				</Col>

				<Col md={12} lg={6}>
					<Panel header="Степен на скобите" >
						Максимална <Input.CustomText label="" transform={this.numTrans} value={data} bind="powTerm"/>
					</Panel>
				</Col>

				<Col md={12} lg={6}>
				<Panel header="Брой на скобите" >
					<Col md={6}>
						Минимум <Input.CustomText transform={this.numTrans} value={data.Term} bind="min"/>
					</Col>
					<Col md={6}>
						Максимум <Input.CustomText transform={this.numTrans} value={data.Term} bind="max"/>
					</Col>
				</Panel>
				</Col>

				<Col md={12} lg={12}>

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

					<Col md={12} lg={6}>	

					<Panel header="Числител">
						<Col md={6}>
							максимум <Input.CustomText transform={this.numTrans} value={data.root.up} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.CustomText transform={this.numTrans} value={data.root.up} bind="low"/>
						</Col>
					</Panel>
					</Col>


					<Col md={12} lg={6}>	
					<Panel header="Знаменател" >
						<Col md={6}>
							максимум <Input.CustomText transform={this.numTrans} value={data.root.down} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.CustomText transform={this.numTrans} value={data.root.down} bind="low"/>
						</Col>
					</Panel>
					</Col>

				</Panel>
				</Col>

				<Col md={12} lg={12}>
				
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

					<Col md={12} lg={6}>	
					<Panel header="Числител" >
						<Col md={6}>
							максимум <Input.CustomText transform={this.numTrans} value={data.coef.up} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.CustomText transform={this.numTrans} value={data.coef.up} bind="low"/>
						</Col>
					</Panel>
					</Col>

					<Col md={12} lg={6}>
					<Panel header="Знаменател" >
						<Col md={6}>
							максимум <Input.CustomText transform={this.numTrans} value={data.coef.down} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.CustomText transform={this.numTrans} value={data.coef.down} bind="low"/>
						</Col>
					</Panel>
					</Col>

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

					<Col md={12} lg={6}>
						
					<Panel header="Числител" >
						<Col md={6}>
							максимум <Input.CustomText transform={this.numTrans} value={data.tcoef.up} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.CustomText transform={this.numTrans} value={data.tcoef.up} bind="low"/>
						</Col>
					</Panel>
					</Col>
					
					<Col md={12} lg={6}>

					<Panel header="Знаменател" >
						<Col md={6}>
							максимум <Input.CustomText transform={this.numTrans} value={data.tcoef.down} bind="high"/>
						</Col>
						<Col md={6}>
							минимум <Input.CustomText transform={this.numTrans} value={data.tcoef.down} bind="low"/>
						</Col>
					</Panel>
					</Col>


				</Panel>
				</Col>

			</Row>
		);
    }
}
