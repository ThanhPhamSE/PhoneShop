using WebAPI.ViewModel.Product;

namespace WebAPI.Repository.IRepository
{
    public interface IProductDetailRepository
    {
        Task<ProductViewModels> GetProductByIdAsync(Guid productId);

    }
}
