import { roles } from '../../middleware/auth.js';

export const endPoints = {
    create: [roles.Admin],
    delete: [roles.Admin],
    get: [roles.Admin],
    clear: [roles.Admin],
}