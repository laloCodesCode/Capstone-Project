// interfaces for login, registration and token generation
// export interface UserCreate {
//   first_name: string;
//   last_name: string;
//   email: string;
//   username: string;
//   password: string;
// }
// export interface UserResponse {
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   username: string;
//   role: string;
// }
// export interface TokenResponse {
//   access_token: string;
//   token_type: string;
// }
// export interface AuthUser {
//   token: string;
// }
//
// // interface for user profile
// export interface MeResponse {
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   username: string;
//   email: string;
// }
//
// //Password Change
// export interface PasswordChange {
//   current_password: string;
//   new_password: string;
// }

/*
 * New Interfaces for the updated backend
 * I will take out the olds ones once the new backend is fully tested
 *
 * */

export interface UserRegister {
  username: string;
  school_email: string;
  phone_number: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  school_email: string;
  phone_number: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface MeResponse {
  user_id: string;
  username: string;
  school_email: string;
  is_admin: boolean;
}

export interface MessageResponse {
  message: string;
}

//administrator
export interface AdminUser {
  id: string;
  username: string;
  school_email: string;
  is_admin: boolean;
  is_email_verified: boolean;
  is_banned: boolean;
}

export interface AdminMessageResponse {
  message: string;
}

export interface ListingResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  condtion: string;
  location: string;
  status: string;
  seller_id: string;
  category_id: string | null;
  created_at: string;
}

// export interface ReviewResponse {
//   id: string;
//   reviewer_id: string;
//   reviewed_user_id: string;
//   rating: number;
//   comment: string | null;
//   created_at: string;
// }

export interface ReviewResponse {
  id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

//allowing a user to updated a listing they are posted !
export interface ListingUpdate {
  title?: string;
  description?: string;
  price?: string;
  condtion?: string;
  location?: string;
  category_id?: string;
  status?: string;
}
