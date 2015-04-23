import http from "superagent"


// cor == count of return 
// or the count of fileds to return

export default class GeneratorApi{
	generate(address,data,cor,token){
			http.post("/api" + address).send(model.data).send({cor:cor, token: token}).end(function(err, res){
			if(res.status == 200){
				model.res = JSON.parse(res.text)
				return model.res;

			}else{
				return err;
			}
		});
	}
}