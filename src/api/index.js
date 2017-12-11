import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import properties from './properties';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	api.get('/properties/:query/:distance', properties);

	api.get('/health', (req, res) => {
		res.send(200);
	});

	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
