using WebAPI.ViewModel;

namespace WebAPI.Repository
{
    public interface IProductManageRepository
    {
        Task<IEnumerable<ProductPMViewModel>> GetAllProductsAsync();
        Task<ProductPMViewModel> GetProductByIdAsync(Guid productId);
        Task<bool> CreateProductAsync(ProductPMViewModel productVm);
        Task<int> UpdateProductAsync(Guid ProductId, ProductPMViewModel productVm);
        Task<bool> DeleteProductAsync(Guid productId);
        Task<IEnumerable<BrandPMViewModel>> GetAllBrandsAsync();
        Task<BrandPMViewModel> GetBrandByIdAsync(Guid brandId);
    }
}
