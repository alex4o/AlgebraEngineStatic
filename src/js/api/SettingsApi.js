import http from "superagent"

export default class SettingsApi{
	static createSetting(credentials,callback){

	}

	static saveSetting(credentials,callback){

	}

	static getSettings(token){
		return [
				{name: "Лесно"},
				{name: "Трудно"},
				{name: "Невъзможно"}
			]

	}
}