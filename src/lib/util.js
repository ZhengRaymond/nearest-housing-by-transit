import Promise from 'promise';
/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status=200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}


export function QueryStringToJSON(input) {
  var pairs = input.split('&');

  var result = {};
  pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}

export function googleAsynch(call, params) {
	try {
		let response = new Promise((resolve, reject) => {
			call(params, (err, data) => {
				if (err) reject(err);
				resolve(data);
			});
		});
		return [null, response];
	}
	catch(err) {
		return [err, null];
	}
}
