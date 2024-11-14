using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.ViewModel;

namespace WebAPI.Repository
{
    public class ProductManagerRepository : IProductManageRepository
    {
        private readonly AppDBContext _context;
        public ProductManagerRepository(AppDBContext context)
        {
            _context = context;
        }
        public async Task<bool> CreateProductAsync(ProductPMViewModel productVm)
        {
            Product product = new Product()
            {
                BrandId = productVm.BrandId,
                ProductId = productVm.ProductId,
                ProductName = productVm.ProductName,
                Title = productVm.Title,
                Description = productVm.Description,
                Color = productVm.Color,
                CostPrice = productVm.CostPrice,
                SellPrice = productVm.SellPrice,
                Stock = productVm.Stock,
                ImageUrl = productVm.ImageUrl
            };

            await _context.Products.AddAsync(product);
            bool isCreated = await _context.SaveChangesAsync() > 0;
            return isCreated;
        }

        public async Task<bool> DeleteProductAsync(Guid productId)
        {
            Product product = await _context.Products.FindAsync(productId);

            if (product == null)
            {
                return false;
            }
            else
            {
                _context.Products.Remove(product);
                bool isDeleted = await _context.SaveChangesAsync() > 0;
                return isDeleted;
            }
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

        public async Task<int> UpdateProductAsync(Guid Id, ProductPMViewModel productVm)
        {
            Product product = await _context.Products.FindAsync(Id);

            if (product == null)
            {
                return -1; // Trả về -1 nếu không tìm thấy sản phẩm
            }

            // Cập nhật các thuộc tính của product từ productVm
            product.BrandId = productVm.BrandId;
            product.ProductName = productVm.ProductName;
            product.Title = productVm.Title;
            product.Description = productVm.Description;
            product.Color = productVm.Color;
            product.CostPrice = productVm.CostPrice;
            product.SellPrice = productVm.SellPrice;
            product.Stock = productVm.Stock;
            product.ImageUrl = productVm.ImageUrl;

            int result = await _context.SaveChangesAsync();

            return result > 0 ? 1 : 0; // Trả về 1 nếu cập nhật thành công, 0 nếu không có thay đổi
        }
        public async Task<IEnumerable<ProductPMViewModel>> GetAllProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            List<ProductPMViewModel> productVms = new List<ProductPMViewModel>();
            foreach (var product in products)
            {
                ProductPMViewModel productManageGetVM = new ProductPMViewModel()
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
                productVms.Add(productManageGetVM);
            }

            return productVms;
        }

        public async Task<IEnumerable<BrandPMViewModel>> GetAllBrandsAsync()
        {
            List<BrandPMViewModel> brands = new List<BrandPMViewModel>();
            var brandsFromDb = await _context.Brands.ToListAsync();
            foreach (var brand in brandsFromDb)
            {
                BrandPMViewModel brandVm = new BrandPMViewModel()
                {
                    BrandId = brand.BrandId,
                    BrandName = brand.BrandName
                };
                brands.Add(brandVm);
            }
            return brands;
        }

        public async Task<BrandPMViewModel> GetBrandByIdAsync(Guid brandId)
        {
            Brand brand = await _context.Brands.FindAsync(brandId);
            if (brand == null) { return null; }
            BrandPMViewModel brandVm = new BrandPMViewModel()
            {
                BrandId = brand.BrandId,
                BrandName = brand.BrandName
            };
            return brandVm;
        }
    }
}
