import alt from "../alt";

import UserStore from "../stores/user"
import UserActions from "../actions/user"

import GeneratorApi from "../api/GeneratorApi"

class GeneratorActions
{
	generated(gen){
		this.dispatch(gen);
	}

	requestGenerate(adress,descriptor,cor){

		this.dispatch({adress,descriptor,cor});

		UserActions.checkLogIn();

		var userData = UserStore.getState();
		GeneratorApi.generate(adress,descriptor,cor,userData.token,(gen,err) => {
			this.actions.generated(gen);
		});
	}
}

export default alt.createActions(GeneratorActions)
