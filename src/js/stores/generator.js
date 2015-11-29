import alt from "../alt"
import GeneratorActions from "../actions/generator"


class GeneratorStore
{
	constructor(){
		this.bindActions({onGenerated: GeneratorActions.generated})
		
	}

	onGenerated(res){
		if(res.length > 1){
			this.list = res
		}else{
			this.math = res[0]
		}
	}
}

export default alt.createStore(GeneratorStore);