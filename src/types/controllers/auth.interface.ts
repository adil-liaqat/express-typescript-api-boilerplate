export interface UserRegister {
  first_name: string,
  last_name: string,
  password: string,
  confirm_password: string,
  email: string,
}

export interface UserVerify {
  token: string,
}

export interface UserBodyEmail {
  email: string,
}
