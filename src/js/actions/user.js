var alt = require('../alt');
var UserApi = require('../api/UserApi');

class UserActions {

	receiveLoginToken(token) {
		this.dispatch(token);
	}

	receiveRegisterStatus(status){
		this.dispatch(status);
	}

	receiveLoginError(error){
		this.dispatch(error);
	}

	receiveRegisterError(error){
		this.dispatch(error);

	}

	exit(){
		this.dispatch();
		sessionStorage.removeItem("token");
		this.actions.receiveLoginToken({data :{user: ""}})
	}

	checkLogIn(){
		this.dispatch();
		var data = JSON.parse(sessionStorage.getItem("token"))
		console.log(data)
		
		if(data  == null){
			this.actions.receiveLoginToken({data :{user: ""}})
			return;
		}

		if(new Date(data.data.exp*1000) > Date.now()){
			this.actions.receiveLoginToken(data)
		}else{
			this.actions.receiveLoginToken({data :{user: ""}})
			sessionStorage.removeItem("token");
		}
	}

	requestRegister(credentials){
		var self = this;
		this.dispatch();
		if(credentials.pass.length < 6){
			this.actions.receiveRegisterStatus({ok: false, error: "Паролате е по-къса от 6 сивмвола"})

			return;
		}

		if(credentials.pass == credentials.passAgain){
			delete credentials.passAgain;
			UserApi.register(credentials,this.actions.receiveRegisterStatus);
		}else{
			this.actions.receiveRegisterStatus({ok: false, error: "Различни пароли, паролите трябва съвпадат"})
		}

	}

	requestLogIn(credentials) {
		var self = this;
		this.dispatch();

		UserApi.login(credentials,function(res,err) {
			if(res != null){
				sessionStorage.setItem('token', JSON.stringify(res));
				self.actions.receiveLoginToken(res);
				console.log("received login token");
			}else{
				self.actions.receiveLoginError(err);

			}

		})

		console.log("requested login");
	}
}

export default alt.createActions(UserActions)