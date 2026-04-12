import { logger } from '@aperta/logging';

export const loggers = {
	infra: logger('infra'),
	data: logger('data'),
	ai: logger('ai'),
	security: logger('security')
};
