using WebAPI.ViewModel;
using WebAPI.ViewModel.ProductManager;

namespace WebAPI.Repository.IRepository
{
    public interface IHomeRepository
    {
       Task<IEnumerable<ProductPMViewModel>> GetAllProductsAsync( string? brand,string search, decimal? from, decimal? to, string? sort, int page, int pageSize = 6);
        Task<ProductPMViewModel> GetProductByIdAsync(Guid productId);
        Task<IEnumerable<BrandPMViewModel>> GetAllBrandsAsync();
        Task<BrandPMViewModel> GetBrandByIdAsync(Guid brandId);

        Task<IEnumerable<ProductPMViewModel>> GetAllProductsAsync();

        Task<int> GetTotalProductCountAsync(string? brand, string search, decimal? from, decimal? to);

    }
}
