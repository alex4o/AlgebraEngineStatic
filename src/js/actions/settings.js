import alt from "../alt";

class SettingsActions
{
	receivedSettings(settings){
		this.dispatch(settings)
	}

	receivedError(error){
		this.dispatch(error);
	}

	createSetting(type,setting){
		this.dispatch({type,setting});
	}

	saveSetting(type,setting){
		this.dispatch({type,setting});
	}

	getSettings(userId){
		this.dispatch(userId);
	}
}

export default alt.createActions(SettingsActions)
