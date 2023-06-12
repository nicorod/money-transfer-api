
enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

interface User {
    id?: number;
    name: string;
    role: UserRole;
}

export { User, UserRole};