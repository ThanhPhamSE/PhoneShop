﻿using WebAPI.ViewModel.UserInformation;

namespace WebAPI.Repository.IRepository
{
    public interface IUserRepository
    {
        Task<UserViewModel> GetUserByEmail(string email);

        Task<AddressViewModel> GetAddressByUserId(Guid id);
        Task UpdateAddress(Guid userId, AddressViewModel updatedAddress);
        Task UpdateUser(Guid userId, UserViewModel updatedUser);
        Task<bool> ChangePassword(string email, string oldPassword, string newPassword);


    }
}
