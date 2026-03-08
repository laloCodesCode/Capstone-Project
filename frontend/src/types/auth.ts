// These analogous to my schemas in FastAPI
export interface UserCreate{
    first_name: string;
    last_name: string;
    email: string;
    username: string
    password: string;
}
export interface UserResponse{
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
}
export interface TokenResponse{
    access_token: string;
    token_type: string;
}
export interface AuthUser{
    token: string;
}