import alt from "../alt"
import UserActions from "../actions/user"
import ErrorActions from "../actions/error"
class ErrorStore
{
	constructor(){
		this.bindActions(
			{
				onRegisterError: UserActions.registerStatus,
				onLoginError: UserActions.loginError,
				onConsumeError: ErrorActions.consume
			}
		)
		this.error = {};
		this.ok = true;
	}

	onRegisterError(error){
		this.error = error
		this.ok = false
	}

	onLoginError(error){
		this.error = error
		this.ok = false
	}

	onConsumeError(error){
		this.error = null
		this.ok = true
	}

	
}

export default alt.createStore(ErrorStore);