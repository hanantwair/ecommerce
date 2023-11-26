import { roles } from '../../middleware/auth.js'

export const endPoint = {
    getAll: [roles.Admin],
    getActive: [roles.User],
    spesific: [roles.Admin, roles.User],
    create: [roles.Admin],
    update: [roles.Admin],
}