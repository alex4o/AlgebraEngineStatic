import alt from "../alt"
import SettingsActions from "../actions/settings"

class SettingsStore
{
	constructor(){
			this.bindActions(
				{
					onLoad: SettingsActions.load,
					onSelect: SettingsActions.select,
					onAdd: SettingsActions.add,
					onSave: SettingsActions.save,
					onRemove: SettingsActions.remove,
					onError: SettingsActions.receivedError

				}
			)
		this.settings = {}
		this.selectedSetting = {}
		this.selectedSettingIndex = 0
	}

	onError(error){
		this.error = error;
	}

	onLoad(data){
		let {type,settings} = data
		this.selectedType = type
		this.settings[type] = settings
		if(settings == null || settings.length == 0){
			return;
		}
		this.selectedSetting = settings[this.selectedSettingIndex].setting
		
		for(let i in settings){ // bad way to do this but simpler
			if(settings[i].name == null){
				settings[i].name = "Undefined";			}
		}
	}

	onRemove(data){
		let {type,settings} = data
		this.settings[type] = settings
	}

	onAdd(data){
		let {type,settings} = data
		this.settings[type] = settings
	}

	onSave(data){
		let {type,settings} = data
		this.settings[type] = settings
	}

	onSelect(index){
		this.selectedSetting = this.settings[this.selectedType][index].setting
		this.selectedSettingIndex = index
	}


}

export default alt.createStore(SettingsStore);