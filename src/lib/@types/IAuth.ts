

export interface ISignUp {
    email: string;
    password: string;
    name: string;
    imageURL?: string;
    role: string;
}

export interface ISignIn {
    email: string;
    password: string;
}