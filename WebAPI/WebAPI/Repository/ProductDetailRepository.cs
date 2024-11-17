using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel;

namespace WebAPI.Repository
{
    public class ProductDetailRepository : IProductDetailRepository
    {
        private readonly AppDBContext _context;
        public ProductDetailRepository(AppDBContext context)
        {
            _context = context;
        }
        public async Task<ProductPMViewModel> GetProductByIdAsync(Guid productId)
        {
                Product product = await _context.Products.FindAsync(productId);
                if (product == null) { return null; }
                ProductPMViewModel productVm = new ProductPMViewModel()
                {
                    ProductId = product.ProductId,
                    BrandId = product.BrandId,
                    ProductName = product.ProductName,
                    Title = product.Title,
                    Description = product.Description,
                    Color = product.Color,
                    CostPrice = product.CostPrice,
                    SellPrice = product.SellPrice,
                    Stock = product.Stock,
                    ImageUrl = product.ImageUrl
                };
                return productVm;
        }
    }
}
