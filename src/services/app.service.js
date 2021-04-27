const aborter = new AbortController();

const fillSeats = async function (rcs , passengers) {
    try {
		let response = await fetch( `http://localhost:8080/v1/fillSeats`, {
			method: "POST",
			headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                rowsAndColumns : rcs,
                noOfPassengers : passengers
            })
		})
        let responseType = response.headers.get('content-type')
        let data = null;
        if(responseType && responseType.indexOf('application/json') > -1) {
            let t = await response.text();
            try {
                data = JSON.parse(t);
            }
            catch {
                data = t;
            }
        }
        else {
            data = await response.text();
        }
        if(response.ok) {
            if(data) return data;
            else return response;
        }
        else{
            if(data) throw data;
            else throw response;
        }
    } catch (e) {
        throw e;
    }
}

export default {
    fillSeats,
    aborter
};
