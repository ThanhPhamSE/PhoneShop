using WebAPI.ViewModel;
using WebAPI.ViewModel.CheckOut;

namespace WebAPI.Repository
{
    public interface IOrderRepository
    {
        Task<IEnumerable<OrderVm>> GetAlls();
        Task<IEnumerable<OrderVm>> GetOrderByStatus(string status);
        Task<bool> ChangeStatusOrder(Guid orderId, string status);
        Task<UserVm> GetUserById(Guid userId);
        Task<IEnumerable<OrderVm>> GetUserByEmail(string email);
    }
}
