import { roles } from '../../middleware/auth.js';

export const endPoint = {
    create: [roles.Admin],
    get: [roles.User, roles.Admin],
}