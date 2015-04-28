import alt from "../alt"
import GeneratorActions from "../actions/generator"


class GeneratorStore
{
	constructor(){
		this.bindActions({onGenerated: GeneratorActions.generated})
		
	}

	onGenerated(res){
		this.results = res;
	}
}

export default alt.createStore(GeneratorStore);