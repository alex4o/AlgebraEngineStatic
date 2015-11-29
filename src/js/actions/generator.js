import alt from "../alt";

import UserStore from "../stores/user"
import UserActions from "../actions/user"

import GeneratorApi from "../api/GeneratorApi"

class GeneratorActions
{
	generated(res){
		this.dispatch(res.data)
	}

	error(error){
		this.dispatch(error)
	}

	generate(adress,descriptor,cor){

		this.dispatch({adress,descriptor,cor});

		 

		var userData = UserStore.getState();

		return GeneratorApi.generate(adress,descriptor,cor,userData.token)
			.then(this.actions.generated)
			.catch(this.actions.error)
	}
}

export default alt.createActions(GeneratorActions)
