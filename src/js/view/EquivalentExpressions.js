import React from 'react';
import Input from '../input';
import {Row,Button,Grid,Col,Panel,DropdownButton} from 'react-bootstrap';

export default class EquivalentExpression extends React.Component
{
	componentWillMount(){
		this.props.onChange("/gen/EquivalentExpression/")
		this.default = {
			pow:2,
			let:"xyz",
			factored:false,
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
		}
		this.props.check(this.default)
		let {numberTransform,stringCheck} = this.props.validator

		this.numberTransform = numberTransform;
		this.stringCheck = stringCheck;
	}

	render() {

		let data = this.props.setting

		if(Object.keys(this.props.setting).length == 0){
			data = this.default
		}
		
		return (
			<Row>
				<Col md={12} lg={12}>

				<Panel header="Тип задачи">
					<Col md={12}>
						<Input.RadioList 
							value={data} 
							bind="factored" 
							options={
								[
									{key:false,value:"Опрости"},
									{key:true,value:"Разложи"}									
								]}
							default={data.factored}/>
					</Col>
				</Panel>
				</Col>
			
				<Col md={6} lg={6}>
					<Panel header="Променливи" >
						<Input.CustomText transform={this.stringCheck} value={data} bind="let"/>
					</Panel>
				</Col>

				<Col md={6} lg={6}>

				<Panel header="Максимална Степен" >
					<Col md={12}>
						<Input.CustomText transform={this.numberTransform} value={data} bind="pow"/>
					</Col>
				</Panel>
				</Col>

				<Col md={12} lg={6}>
				<Panel header="Брой на скобите" >
					<Col md={6}>
						Минимум <Input.CustomText transform={this.numberTransform} value={data.Term} bind="min"/>
					</Col>
					<Col md={6}>
						Максимум <Input.CustomText transform={this.numberTransform} value={data.Term} bind="max"/>
					</Col>
				</Panel>
				</Col>



				<Col md={12} lg={6}>

				<Panel header="Брой елементи в скобите" >
					<Col md={6}>
						Минимум <Input.CustomText transform={this.numberTransform} value={data.Letters} bind="min"/>
					</Col>
					<Col md={6}>
						Максимум <Input.CustomText transform={this.numberTransform} value={data.Letters} bind="max"/>
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
};
