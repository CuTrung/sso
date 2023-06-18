import {
  PartialType,
  OmitType,
  IntersectionType,
  PickType,
} from '@nestjs/mapped-types';
import { User } from './user.entity';

export class CreateUserDTO extends OmitType(User, ['id']) {}

export class UpdateUserDTO extends IntersectionType(
  PickType(User, ['id']),
  PartialType(CreateUserDTO),
) {}

export class CheckAccountExistDTO extends PickType(PartialType(User), [
  'email',
  'name',
  'phoneNumber',
]) {}

// DTO: Data Transfer Object
// DTO tạo ra để hứng (gom nhóm) các data gửi từ client. Data từ client thường là phức hợp giữa các table khác nhau, DTO sinh ra để là điểm chung, là cầu nối, là đại diện kiểu dữ liệu cho 'data' đó. Ví dụ có 2 class là Student và Role, data từ client bao gồm các field của Student và Role, thì tạo một DTO CreateStudent (Ở đây Student là đối tượng chính). DTO sẽ thực hiện gửi dữ liệu tương ứng cho Student và Role. Sau đó Student và Role sẽ trả về data response  ở dạng DTO tương ứng. Ngoài ra DTO còn cho phép 'che dấu' một số trường nhạy cảm của entity (password). DTO giúp giảm số lần gọi đến api (gọi lần 1 để láy ra studentId, gọi lần 2 để lấy ra role tương ứng => Upgrade: Chỉ cần gọi 1 api lấy ra DTO đại diện cho cả Student và Role)
