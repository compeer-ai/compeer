import { pino } from 'pino';

const logger = pino();
const infra = logger.child({ namespace: 'infra' });
const data = logger.child({ namespace: 'data' });
const ai = logger.child({ namespace: 'ai' });
const security = logger.child({ namespace: 'security' });

export const loggers = {
	infra,
	data,
	ai,
	security
};
