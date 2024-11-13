using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.Product;

namespace WebAPI.Repository
{
    public class ProductDetailsRepository : IProductDetailRepository
    {
        private readonly AppDBContext _context;
        public ProductDetailsRepository(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ProductViewModels> GetProductByIdAsync(Guid productId)
        {
            // Truy vấn sản phẩm theo ID và bao gồm cả thông tin thương hiệu
            var product = await _context.Products
                .Include(p => p.Brand)  // Bao gồm cả thương hiệu của sản phẩm
                .Where(p => p.ProductId == productId)
                .Select(p => new ProductViewModels
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Title = p.Title,
                    Description = p.Description,
                    CostPrice = p.CostPrice,
                    SellPrice = p.SellPrice,
                    Stock = p.Stock,
                    Color = p.Color,
                    ImageUrl = p.ImageUrl,
                    BrandId = p.BrandId,
                    BrandName = p.Brand.BrandName  // Lấy tên thương hiệu
                })
                .FirstOrDefaultAsync();

            return product;
        }

    }
}
