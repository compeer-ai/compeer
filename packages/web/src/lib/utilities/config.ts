import fileConfiguration from '../assets/config.json';
import defaultConfiguration from '../assets/defaultConfig.json';

export const config = {
	...defaultConfiguration,
	...fileConfiguration
};
