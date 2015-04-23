var alt = require('../alt');
var UserApi = require('../../api/UserApi');

class UserActions {

	receiveLoginToken(token) {
		this.dispatch(token);
	}

	receiveLoginError(error) {
		this.dispatch(error);
	}

	receiveRegisterStatus(status){
		this.dispatch(status);

	}

	receiveRegisterError(error){
		this.dispatch(error);

	}

	checkLogIn(){
		this.dispatch();
		var data = sessionStorage.getItem("token")
		if(new Date(data.data.exp*1000) > Data.now()){
			this.actions.receiveLoginToken(data)
		}
	}

	requestLogIn(credentials) {
		var self = this;
		this.dispatch();

		UserApi.login(credentials,function(res,err) {
			if(res != null){
				sessionStorage.setItem('token', JSON.stringify(res.data));
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