import alt from "../alt";
import SettingsApi from "../api/SettingsApi"

class SettingsActions
{
	receivedSettings(settings,type){
		this.dispatch({settings,type})
	}

	receivedError(error){
		this.dispatch(error);
	}

	save(type,setting,index){
		let settings = []
		if(localStorage[type] != null && localStorage[type] != ""){
			settings = JSON.parse(localStorage[type])
		}
		settings[index].setting = setting
		localStorage[type] = JSON.stringify(settings)
		this.dispatch({type, settings})
	}

	add(type,setting,name){
		
		let settings = []
		if(localStorage[type] != null && localStorage[type] != ""){
			settings = JSON.parse(localStorage[type])
		}
		settings.push({name, setting})
		localStorage[type] = JSON.stringify(settings)
		this.dispatch({type, settings})
	}

	remove(type, index){
		let settings = []
		if(localStorage[type] != null && localStorage[type] != ""){
			settings = JSON.parse(localStorage[type])
		}
		if(settings.length != 0){
			settings.splice(index, 1)
		}
		localStorage[type] = JSON.stringify(settings)
		this.dispatch({type, settings})
	}

	select(index){
		this.dispatch(index)
	}

	load(type){
		if(localStorage[type] != null && localStorage[type] != ""){
			let settings = JSON.parse(localStorage[type]);
			this.dispatch({type,settings});
		}else{
			this.dispatch({type,null})
		}
	}
}

export default alt.createActions(SettingsActions)
