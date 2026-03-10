// interfaces for login, registration and token generation
export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
}
export interface UserResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
}
export interface TokenResponse {
  access_token: string;
  token_type: string;
}
export interface AuthUser {
  token: string;
}

// interface for user profile
// TODO : change the backend to return first_name, last_name and add the ability to change password
export interface MeResponse {
  user_id: string;
  username: string;
  email: string;
}
