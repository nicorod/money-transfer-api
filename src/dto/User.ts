
enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

interface User {
    id?: number;
    name: string;
    role: UserRole;
    email: string;
    password: string;
}

export { User, UserRole};