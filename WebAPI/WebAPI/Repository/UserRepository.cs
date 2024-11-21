using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.UserInformation;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace WebAPI.Repository
{
    public class UserRepository : IUserRepository
    {

        private readonly AppDBContext _context;

        public UserRepository(AppDBContext context)
        {
            _context = context;
        }

        public async Task<AddressViewModel> GetAddressByUserId(Guid id)
        {
            //Tìm thông tin địa chỉ theo UserId
            var addressId = await _context.Addresses.Where(a => a.UserId == id)
                                                    .Select(a => new AddressViewModel
            {
                AddressId = a.AddressId,
                City = a.City,
                District = a.District,
                Village = a.Village,
                Description = a.Description,
            }).FirstOrDefaultAsync();

            // Nếu không có địa chỉ, trả về một AddressViewModel rỗng
            if (addressId == null)
            {
                return new AddressViewModel
                {
                    AddressId = Guid.Empty,
                    City = string.Empty,
                    District = string.Empty,
                    Village = string.Empty,
                    Description = string.Empty,
                };
            }
            return addressId;
        }



        public async Task<UserViewModel> GetUserByEmail(string email)
        {
            // Tìm user trong cơ sở dữ liệu dựa trên email
            var user = await _context.Users
                .Where(u => u.Email == email)
                .Select(u => new UserViewModel
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    PasswordHash = u.PasswordHash,
                    PhoneNumber = u.PhoneNumber
                })
                .FirstOrDefaultAsync();

            // Trả về UserViewModel hoặc null nếu không tìm thấy
            return user ?? new UserViewModel
            {
                UserId = Guid.Empty,
                UserName = string.Empty,
                Email = string.Empty,
                PasswordHash = string.Empty,
                PhoneNumber = string.Empty
            };
        }


        public async Task UpdateAddress(Guid userId, AddressViewModel updatedAddress)
        {
            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.UserId == userId);

            if (address == null)
            {
                // Nếu chưa có, thêm mới address 
                address = new Address
                {
           //         AddressId = Guid.NewGuid(),
                    UserId = userId,
                    City = updatedAddress.City,
                    District = updatedAddress.District,
                    Village = updatedAddress.Village,
                    Description = updatedAddress.Description
                };
                _context.Addresses.Add(address);
            }
            else
            {
                // Nếu đã có, cập nhật
                address.City = updatedAddress.City;
                address.District = updatedAddress.District;
                address.Village = updatedAddress.Village;
                address.Description = updatedAddress.Description;
            }

            await _context.SaveChangesAsync();
        }
        public async Task UpdateUser(Guid userId, UserViewModel updatedUser)
        {
            // Tìm user trong cơ sở dữ liệu dựa trên userId
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            // Cập nhật các thông tin của user (trừ Email)
            user.UserName = updatedUser.UserName;
            user.PhoneNumber = updatedUser.PhoneNumber;

            // Lưu thay đổi
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> ChangePassword(string email, string oldPassword, string newPassword)
        {
            // Lấy user từ database dựa trên email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                throw new ArgumentException("Người dùng không tồn tại.");

            // Tạo instance của PasswordHasher
            var passwordHasher = new PasswordHasher<User>();

            // Xác thực mật khẩu cũ
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, oldPassword);
            if (result == PasswordVerificationResult.Failed)
                throw new ArgumentException("Old password is incorrect.");

            // Hash mật khẩu mới
            user.PasswordHash = passwordHasher.HashPassword(user, newPassword);

            // Cập nhật vào database
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }




    }
}
