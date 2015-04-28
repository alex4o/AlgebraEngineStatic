import http from "superagent"


// cor == count of return 
// or the count of fileds to return

export default class GeneratorApi{
	static generate(address,descriptor,cor,token,callback){

		http.post("/api" + address).send(descriptor).send({cor:cor, token: token}).end(function(err, res){
			console.log(err == null)
			if(err == null){
				let out = JSON.parse(res.text)
				console.log(out);
				if(cor > 1){
					callback({list: out });

				}else{
					callback({math: out[0] });

				}
			}else{
				callback(null,err);
			}
		});

	}
}