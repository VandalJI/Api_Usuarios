export class UserDto {
  id: string;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role?: string;
}
