import http from "axios"


// cor == count of return 
// or the count of fileds to return

export default class GeneratorApi{
	static generate(address, descriptor, cor, token){

		descriptor.cor = cor;
		descriptor.token = token;

		return http.post("/api" + address, descriptor)

		/*.then(function(response){
		
			if(err == null){
				
			}else{
				callback(null,err);
			}
		});
*/
	}
}