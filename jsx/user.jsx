var UserForm = React.createClass({
	getInitialState: function() {
		var check_logged = function(){
			if(sessionStorage.getItem("token") == null){
				return {
					logged_in: false
				}

			}

			token = JSON.parse(atob(sessionStorage.getItem("token").split(".")[1]))
			console.log("id " + token.user_id);
			return({
				logged_in: true ,
				username: token.user
			})
		}
		var state = check_logged()
		state.reg_popup = "hidden"
		state.alert_msg = ""
		return state

	},
	login: function(){
		done = this.logged_in
		error = this.error
		superagent.post("/api/login/").send(this.props.data).end(function(res){
			if(res.status != 200){
				error("грешка в сървъра")
			}
			out = JSON.parse(atob(res.text.split(".")[1]))
			console.log(out.user_id)
			if(out.user_id > -1){
				sessionStorage.setItem("token",res.text)
				done()	
			}else{
				error("грешно потребителско име и/или парола")
			}
		});
	},
	error: function(msg){
			this.setState({alert_msg: msg})
			
	},
	logged_in: function(){
		this.setState({ logged_in : true, username: this.props.data.name })
	},
	logout: function(){
		sessionStorage.removeItem("token")
		this.setState({ logged_in : false})

	},
	signup: function(){
		console.log(this.refs)
		this.refs.rform.show()
		//this.setState({reg_popup:"visible"})

	},
	render: function () {
		var data = this.props.data
		if(this.state.logged_in == false){
			
				Panel = (<div>
							<StringInput placeholder="Потребителско име" value={data} bind="name" />
							<PassInput placeholder="Парола" value={data} bind="pass" />
							<div className="myButton" onClick={this.login}>Вход</div>
							<div className="myButton" onClick={this.signup}>Регистрация</div>
							<Alert error_message={this.state.alert_msg}/>
							<RegisterForm ref="rform"/>
						</div>)
			
		}else{
			
				Panel = <div><span>{this.state.username}</span><div className="myButton" onClick={this.logout}>изход</div></div>
		}

		return (
			<div>
				{Panel}
			</div>
		)
	}
});

var Alert = React.createClass({
	componentDidUpdate:function(old,news){
		alert_box = this.refs.alert_box.getDOMNode()
		alert_box.classList.add("alert_show")
		setTimeout(this.hide,1500)
	},
	hide:function(){
		alert_box = this.refs.alert_box.getDOMNode()
		alert_box.classList.remove("alert_show")
	},
	render: function(){
 		return (<div className="alert" ref="alert_box">{this.props.error_message}</div>)

	}

})

var RegisterForm = React.createClass({
	getInitialState: function() {
		return {visability: "hidden"};
	},
	model: {
		username: "",
		password:"",
		pr:""
	},
	show: function(){
		this.setState({visability: "visible"})
		console.log("show")
	},
	register: function(){
		self = this
		if(this.model.password == this.model.pr){
			console.log(this.model)
			delete this.model.pr
			superagent.post("/api/signup/").send(this.model).end(function(res){
				alert("Вие се регистрирахте.")
				self.setState({visability: "hidden"})

			});
			console.log(this.model)
		}
	},

	render: function(){

	return(
		<div className="popup" style={{visibility: this.state.visability}}>
			
			<StringInput value={this.model} bind="username" placeholder="Пoтребителско име"/>
			<PassInput value={this.model} bind="password" placeholder="Парола"/>
			<PassInput value={this.model} bind="pr" placeholder="Поватряне на парола"/>
			<div className="myButton" onClick={this.register}>Регистрирай</div>
		</div>)
	}
})