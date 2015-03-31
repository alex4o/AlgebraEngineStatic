var UserForm = React.createClass({displayName: "UserForm",
	getInitialState: function() {
		var check_logged = function(){
			if(sessionStorage.getItem("token") == null){
				return {
					logged_in: false
				}

			}

			token = atob(sessionStorage.getItem("token").split(".")[1])
			if(token.user_id != -1){
				li = false;
			}else{
				li = true;
			}
			
			return({
				logged_in: li ,
				username: ""
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
			console.log(out)
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
		this.setState({reg_popup:"visible"})

	},
	render: function () {
		var data = this.props.data
		if(this.state.logged_in == false){
			
				Panel = (React.createElement("div", null, 
							React.createElement(StringInput, {placeholder: "Потребителско име", value: data, bind: "name"}), 
							React.createElement(Md5Input, {placeholder: "Парола", value: data, bind: "pass"}), 
							React.createElement("div", {className: "myButton", onClick: this.login}, "Вход"), 
							React.createElement("div", {className: "myButton", onClick: this.signup}, "Регистрация"), 
							React.createElement(Alert, {error_message: this.state.alert_msg}), 
							React.createElement(RegisterForm, {visability: this.state.reg_popup})
						))
			
		}else{
			
				Panel = React.createElement("div", null, React.createElement("span", null, this.state.username), React.createElement("div", {className: "myButton", onClick: this.logout}, "изход"))
		}

		return (
			React.createElement("div", null, 
				Panel
			)
		)
	}
});

var Alert = React.createClass({displayName: "Alert",
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
 		return (React.createElement("div", {className: "alert", ref: "alert_box"}, this.props.error_message))

	}

})

var RegisterForm = React.createClass({displayName: "RegisterForm",
	model: {
		username: "",
		password:"",
		pr:""
	},
	register: function(){
		if(this.model.password == this.model.pr){
			this.model.password = md5(this.model.pr)
			console.log(this.model)
			delete this.model.pr
			superagent.post("/api/signup/").send(this.model).end(function(res){
				alert("Вие се регистрирахте.")

			});
			console.log(this.model)
		}
	},

	render: function(){

	return(
		React.createElement("div", {className: "popup", style: {visibility: this.props.visability}}, 
			
			React.createElement(StringInput, {value: this.model, bind: "username", placeholder: "Пoтребителско име"}), 
			React.createElement(PassInput, {value: this.model, bind: "password", placeholder: "Парола"}), 
			React.createElement(PassInput, {value: this.model, bind: "pr", placeholder: "Поватряне на парола"}), 
			React.createElement("div", {className: "myButton", onClick: this.register}, "Регистрирай")
		))
	}
})