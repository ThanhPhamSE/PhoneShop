using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Repository.IRepository;
using WebAPI.Models;
using WebAPI.ViewModel.Product;

namespace WebAPI.Repository
{
    public class HomeRepository : IHomeRepository
    {
        private readonly AppDBContext _context;

        public HomeRepository(AppDBContext context)
        {
            _context = context;
        }

        // Lấy tất cả các thương hiệu
        public async Task<List<Brand>> GetAllBrandsAsync()
        {
            var brands = await _context.Brands
                .Select(b => new Brand
                {
                    BrandId = b.BrandId,
                    BrandName = b.BrandName,
                    Description = b.Description
                })
                .ToListAsync();

            // Log thông tin các thương hiệu đã lấy
            Console.WriteLine($"Total brands found: {brands.Count}");

            return brands;
        }


        // Lấy tất cả sản phẩm (không có bộ lọc), trả về ProductViewModels
        public async Task<List<ProductViewModels>> GetAllProductsAsync()
        {
            return await _context.Products
                .Include(p => p.Brand)
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
                    BrandName = p.Brand.BrandName,  // Lấy tên thương hiệu
                    BrandId = p.BrandId
                }).ToListAsync();
        }

        // Lấy tất cả sản phẩm có thể lọc theo thương hiệu, màu sắc và mức giá, trả về ProductViewModels
        public async Task<List<ProductViewModels>> GetAllProductsAsync(string brandName, string color, int pageNumber, int pageSize)
        {
            // Bắt đầu với truy vấn cơ bản để lấy tất cả sản phẩm cùng với thương hiệu
            var query = _context.Products.Include(p => p.Brand).AsQueryable();

            // Lọc theo tên thương hiệu nếu có
            if (!string.IsNullOrEmpty(brandName))
            {
                query = query.Where(p => EF.Functions.Like(p.Brand.BrandName, $"%{brandName}%"));
            }

            // Lọc theo màu sắc nếu có
            if (!string.IsNullOrEmpty(color))
            {
                query = query.Where(p => EF.Functions.Like(p.Color, $"%{color}%"));
            }

            // Thực hiện truy vấn với phân trang và trả về danh sách sản phẩm
            return await query.Select(p => new ProductViewModels
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
                BrandName = p.Brand.BrandName,
                BrandId = p.BrandId
            })
            .Skip((pageNumber - 1) * pageSize) // Bỏ qua các sản phẩm của các trang trước
            .Take(pageSize)                    // Giới hạn số lượng sản phẩm trên trang
            .ToListAsync();
        }

    }
}
