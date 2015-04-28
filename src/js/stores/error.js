import alt from "../alt"
import UserActions from "../actions/user"

class UserErrorStore
{
	constructor(){
		this.bindActions(
			{
				onReceiveRegisterStatus: UserActions.receiveRegisterStatus,
				onReceiveLoginError: UserActions.receiveLoginError
			}
		)
		this.data = {};
	}

	onReceiveLoginError(err){
		console.log(err);
		this.error = err;
	}

	onReceiveRegisterStatus(status){
		this.ok = status.ok;
		if(!status.ok){

			this.error = status.error
		}

	}
}

export default alt.createStore(UserErrorStore);