using WebAPI.ViewModel;
using WebAPI.ViewModel.CheckOut;

namespace WebAPI.Repository.IRepository
{
    public interface IConfirmOrderRepository
    {
        Task<AddressViewModel> GetAddressByEmail( string email);

        Task<UserVm> GetUserByEmail(string email);

        Task<bool> AddressUser(AddressViewModel address);

        Task<bool> UpdateAddress(AddressViewModel address);

        Task<bool> AddOrder(OrderVm orderVm);

        Task<bool> AddOrderItem(OrderItemViewModel orderItemViewModel);

        Task<bool> UpdateQuantityAfterPlaceOrder(ProductPMViewModel product);
    }
}
