using WebAPI.ViewModel;

namespace WebAPI.Repository.IRepository
{
    public interface IProductDetailRepository
    {
        Task<ProductPMViewModel> GetProductByIdAsync(Guid productId);

    }
}
