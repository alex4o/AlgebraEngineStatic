import alt from "../alt"
import UserActions from "../actions/user"

class UserStore
{
	constructor(){
		this.bindActions(
			{
				onReceiveLogin: UserActions.receiveLoginToken,
				onReceiveRegisterStatus: UserActions.receiveRegisterStatus
			}
		)
		this.data = {};
	}

	onReceiveLogin(res){
		this.data = res.data;
		this.exp = new Date(res.data.exp*1000)
		this.nbf = new Date(res.data.nbf*1000)
		this.token = res.token;
		console.log("update store")
	}

	onReceiveRegisterStatus(status){
		this.err = status.err

	}

	static tokenValid(){
		if(this.exp == undefined){
			return false;
		}
		if(this.exp > Data.now()){
			return false;
		}
		return true;
	}

	static getToken(){
		return this.token;
	}
}

export default alt.createStore(UserStore);