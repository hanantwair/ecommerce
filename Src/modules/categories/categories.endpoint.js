const roles = {
    Admin: 'Admin',
    User: 'User',
}

export const endpoint = {
    getAll: [roles.Admin],
    getActive: [roles.User],
    spesific: [roles.Admin, roles.User],
    create: [roles.Admin],
    update: [roles.Admin],
}