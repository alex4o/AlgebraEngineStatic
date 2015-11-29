import http from "superagent"

export default class SettingsApi{


	static createSetting(credentials,callback){

	}

	static saveSetting(credentials,callback){

	}

	static getSettings(token,callback){
		http.get("/api/data/settings/").query({token: sessionStorage.getItem("token")}).end((err, res) => {
			callback(JSON.parse(res.text));
		});

		/* return [
				{name: "Лесно"},
				{name: "Трудно"},
				{name: "Невъзможно"}
			]
*/
	}
}