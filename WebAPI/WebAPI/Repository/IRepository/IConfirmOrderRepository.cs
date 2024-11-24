using WebAPI.ViewModel.CheckOut;

namespace WebAPI.Repository.IRepository
{
    public interface IConfirmOrderRepository
    {
        Task<AddressViewModel> GetAddressByEmail( string email);


    }
}
