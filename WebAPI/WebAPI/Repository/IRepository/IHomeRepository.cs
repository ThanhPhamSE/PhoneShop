using WebAPI.Models;
using WebAPI.ViewModel.Product;

namespace WebAPI.Repository.IRepository
{
    public interface IHomeRepository
    {
        Task<List<ProductViewModels>> GetAllProductsAsync();  // Change return type to ProductViewModels
        Task<List<ProductViewModels>> GetAllProductsAsync(string brandName, string color, int pageNumber, int pageSize);  // Change return type to ProductViewModels
        Task<List<Brand>> GetAllBrandsAsync();
    }
}
