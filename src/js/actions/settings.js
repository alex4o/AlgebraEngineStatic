import alt from "../alt";

import UserStore from "../stores/user"
import SettingsApi from "../../api/"
class SettingsActions
{
	receivedSettings(settings){
		this.dispatch(settings)
	}

	receivedError(error){
		this.dispatch(error);
	}

	createSetting(type,setting){
		self = this;
		this.dispatch(type);
		if(UserStore.tokenValid()){
			SettingsApi.createSetting(type,,(error) => {
				if(error != null){
					self.getSettings(type);
				}else{
					self.receivedError(error);
				}
			});
		}else{
			this.receivedError(0);
		}	
	}

	saveSetting(type,setting){
		this.dispatch(type);
		if(UserStore.tokenValid()){
			SettingsApi.saveSettings(type,(error) => {
				if(error != null){
					self.getSettings(type);
				}else{
					self.receivedError(error);
				}
			});
		}else{
			this.receivedError(0);
		}
	}

	getSettings(type){
		this.dispatch(type);
		if(UserStore.tokenValid()){
			SettingsApi.getSettings((settings,error) => {
				if(error != null){
					self.receivedSettings(settings);
				}else{
					self.receivedError(error);
				}
			});
		}else{
			this.receivedError(0);
		}
	}
}