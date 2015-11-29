var alt = require('../alt');
var UserApi = require('../api/UserApi');

class UserActions {

	receiveLoginToken(res){
		if(res.data.ok){
			let token = atob(res.data.token.split(".")[1]);
			let jwt_data = JSON.parse(token)
			let store = {data: jwt_data, token: res.data.token}
			console.log("received login token");
			this.actions.loginToken(store);
		}else{
			this.actions.loginError({error: res.data.msg});
		}
	}

	loginToken(res) {
		sessionStorage.setItem('token', JSON.stringify(res))
		this.dispatch(res)		
	}

	registerStatus(res){
		if(res.data.ok){
			this.dispatch(res.data);
		}else{
			this.dispatch({error: res.data.msg});
		}
	}

	loginError(error){
		this.dispatch(error);
	}

	registerError(error){
		this.dispatch(error);
	}

	exit(){
		this.dispatch();
		sessionStorage.removeItem("token");
		this.actions.loginToken({data :{user: null}})
	}

	checkLogin(){
		this.dispatch();
		let ses = JSON.parse(sessionStorage.getItem("token"))
		console.log(ses)
		
		if(ses != null){
			if(new Date(ses.data.exp*1000) > Date.now()){
				this.actions.loginToken(ses)
			}else{
				this.actions.loginToken({data :{user: null}})
				sessionStorage.removeItem("token");
			}
		}		
	}

	register(credentials){
		var self = this;
		this.dispatch();

		if(credentials.pass.length < 6){
			this.actions.registerError({error: "Паролате е по-къса от 6 сивмвола"})
			return;
		}

		if(credentials.pass != credentials.passAgain){
			this.actions.registerError({error: "Различни пароли, паролите трябва съвпадат"})
			return;
		}
		
		delete credentials.passAgain;
		return UserApi.register(credentials)
			.then(this.actions.registerStatus)
			.catch(this.actions.registerError)
		

	}

	login(credentials) {
		return UserApi.login(credentials)
			.then(this.actions.receiveLoginToken)
			.catch(this.actions.loginError)

		console.log("requested login:", credentials.username);
	}
}

export default alt.createActions(UserActions)