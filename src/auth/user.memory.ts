export type UserRecord = {
    id: string,
    email: string,
    passwordHash: string
}

const UserDB: UserRecord[] = []

export function findUserByEmail(email:string) {
    return UserDB.find(user => user.email == email)
}

export function createUser(user: UserRecord){
    UserDB.push(user)
    return user
}