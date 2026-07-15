import { hc } from 'hono/client';
import type { AppType } from './api';
import type { RemotesAppType } from './remotes';

export const remoteClient = hc<RemotesAppType>("http://localhost:5173");