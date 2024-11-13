using WebAPI.Models;
using WebAPI.ViewModel;
using System.Threading.Tasks;

namespace WebAPI.Repository
{
    public interface IProductManageRepository
    {
        Task<IEnumerable<ProductViewModel>> GetAllProductsAsync();
        Task<ProductViewModel> GetProductByIdAsync(Guid productId);
        Task<bool> CreateProductAsync(ProductViewModel productVm);
        Task<int> UpdateProductAsync(Guid ProductId,ProductViewModel productVm);
        Task<bool> DeleteProductAsync(Guid productId);
        Task<IEnumerable<BrandPMViewModel>> GetAllBrandsAsync();
        Task<BrandPMViewModel> GetBrandByIdAsync(Guid brandId);
    }
}

