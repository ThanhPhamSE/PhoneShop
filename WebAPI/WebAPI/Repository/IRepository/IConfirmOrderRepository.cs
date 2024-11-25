﻿using WebAPI.ViewModel;
using WebAPI.ViewModel.CheckOut;

namespace WebAPI.Repository.IRepository
{
    public interface IConfirmOrderRepository
    {
        Task<AddressViewModel> GetAddressByEmail( string email);

        Task<UserVm> GetUserByEmail(string email);

        Task<bool> AddressUser(AddressViewModel address);
    }
}
