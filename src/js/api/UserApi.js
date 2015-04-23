import http from "superagent"

export default class UserApi{
	static createUser(credentials,callback){
		console.log(this.credentials)
		http.post("/api/signup/").send(this.model).end(function(err,res){
			callback()
		});
	}

	static login(credentials,callback){
		http.post("/api/login/").send(credentials).end(function(err,res){
			if(res.status != 200){
				callback(null,"грешка в сървъра")
			}
			
			let out = JSON.parse(atob(res.text.split(".")[1]))
			console.log(out.user_id)
			
			if(out.user_id > -1){
				callback({data: out, token: res.text})
					
			}else{
				callback(null,"грешно потребителско име и/или парола")
			}
		});
	}
}