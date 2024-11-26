using WebAPI.ViewModel;

namespace WebAPI.Repository
{
    public interface ICartRepository
    {
        Task<IEnumerable<CartIViewModel>> GetCartItemsByUserIdAsync(string email);
        Task<CartIViewModel> GetCartItemAsync(Guid cartItemId);
        Task<bool> AddCartItemAsync(string userEmail, Guid productd, int quantity);
        Task<bool> UpdateQuantityCartItemAsync(Guid cartId, int quantity);
        Task<bool> DeleteCartItemAsync(Guid cartItemId);
        Task<bool> ClearCartAsync(string email);
    }
}
