import argon2 from "argon2";


export async function hashPassword(plain: string) {
    return await argon2.hash(plain, {
        type: argon2.argon2d,
        memoryCost: 2**16,
        timeCost: 3,
        parallelism: 1
    })
}

export function verifyPassword(hashed: string, plain: string){
    return argon2.verify(hashed, plain)
}