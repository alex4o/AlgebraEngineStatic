import React from "react";

var Generator = React.createClass({
	getInitialState: function(){
		return {
			math: [{problem: "", solution: ""}],
			sv: false,
			list: []
		}
	},
	submit: function(){
		model = window.model
		self = this
		localStorage[model.addres] = JSON.stringify(model.data)
		superagent.post("/api" + model.addres).send(model.data).send({cor:1, token: sessionStorage.getItem("token")}).end(function(res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				self.setState({math: model.res})

			}else{
				self.setState({math: {problem: "error",solution:" --- "} })

				//katex.render("error",problem)


			}
		});
		//alert(math)
		//console.log(math)
		
		//this.setState({math: math})
	},
	submit_more: function(){
		self = this
		model = window.model

		localStorage[model.addres] = JSON.stringify(model.data)
		
		
		superagent.post("/api" + model.addres).send(model.data).send({cor:10, token: sessionStorage.getItem("token")}).end(function(res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				console.log(model.res)

				self.setState({list: model.res})
				console.log(ofset)

			}else{
				//katex.render("error",problem)


			}
		});


		//alert(math)
		//console.log(math)
	},
	show: function(){
		this.setState({sv: !this.state.sv});
	},
	render: function () {
		return (
			<div>

			<MathComponent math={this.state.math} solutionVisable={this.state.sv}/>

			<div id="inner-content" >
				
				<div>
					<div className="menu">
						<div className="menu-item" onClick={this.submit}>Генерирай</div>
						<div className="menu-item" onClick={this.submit_more}>Генерирай няколко</div>
						<Togglemenuitem action={this.show} on="Скрий" off="Покажи">{'{0} отговорите'}</Togglemenuitem>
					</div>
					
					<div id="InputContainer">
						<RouteHandler model={window.model} check={checkStorageForDataOrReturnDefault}/>
					</div>


				</div>

				

			</div>
			
			<PrintListComponent res={this.state.list}/>
			</div>

		);
	}
});

var Togglemenuitem = React.createClass({
	getInitialState: function() {
		return {
			activated: false	
		};
	},
	call: function(activated) {
		this.props.action(this.state.activated)
		this.setState({activated: !this.state.activated})
		console.log()
	},

	render: function() {
		return <div className="menu-item" onClick={this.call}>{this.props.children.format(this.state.activated ? this.props.on : this.props.off)}</div>;
	}
});