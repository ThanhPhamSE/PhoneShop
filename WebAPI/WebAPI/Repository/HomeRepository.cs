using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel;
using WebAPI.ViewModel.ProductManager;

namespace WebAPI.Repository
{
    public class HomeRepository : IHomeRepository
    {
        private readonly AppDBContext _context;
        public static int PAGE_SIZE { get; set; } = 6;
        public HomeRepository(AppDBContext context)
        {
            _context = context;
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

        //public async Task<IEnumerable<ProductPMViewModel>> GetAllProductsAsync(string? brand, string search, decimal? from, decimal? to, string? sort, int page = 1)
        //{
        //    var allPro = _context.Products.AsQueryable();

        //    // Filter by brand if provided
        //    if (!string.IsNullOrEmpty(brand))
        //    {
        //        allPro = allPro.Where(h => h.Brand.BrandName.Contains(brand));
        //    }

        //    // Filter and search
        //    if (!string.IsNullOrEmpty(search))
        //    {
        //        allPro = allPro.Where(h => h.ProductName.Contains(search));
        //    }
        //    if (from.HasValue)
        //    {
        //        allPro = allPro.Where(h => h.SellPrice >= from);
        //    }
        //    if (to.HasValue)
        //    {
        //        allPro = allPro.Where(h => h.SellPrice <= to);
        //    }

        //    // Sorting
        //    allPro = allPro.OrderBy(h => h.ProductName);
        //    // Áp dụng sắp xếp dựa trên `sort` nếu có; nếu không, mặc định sắp xếp theo tên sản phẩm tăng dần
        //    if (!string.IsNullOrEmpty(sort))
        //    {
        //        switch (sort)
        //        {
        //            case "gia_esc":
        //                allPro = allPro.OrderBy(p => p.SellPrice);
        //                break;
        //            case "gia_dsec":
        //                allPro = allPro.OrderByDescending(p => p.SellPrice);
        //                break;
        //            case "ten_esc":
        //                allPro = allPro.OrderBy(p => p.ProductName);
        //                break;
        //            default:
        //                allPro = allPro.OrderBy(h => h.ProductName); // Mặc định sắp xếp theo tên sản phẩm tăng dần
        //                break;
        //        }
        //    }
        //    else
        //    {
        //        // Sắp xếp mặc định nếu không có lựa chọn `sort`
        //        allPro = allPro.OrderBy(h => h.ProductName);
        //    }


        //    // Paginate results
        //    var result = PaginatedList<Product>.Create(allPro, page, PAGE_SIZE);

        //    // Map results to view models
        //    return result.Select(product => new ProductPMViewModel
        //    {
        //        ProductId = product.ProductId,
        //        BrandId = product.BrandId,
        //        ProductName = product.ProductName,
        //        Title = product.Title,
        //        Description = product.Description,
        //        Color = product.Color,
        //        CostPrice = product.CostPrice,
        //        SellPrice = product.SellPrice,
        //        Stock = product.Stock,
        //        ImageUrl = product.ImageUrl
        //    }).ToList();
        //}

        //public async Task<IEnumerable<ProductPMViewModel>> GetAllProductsAsync(
        //                            string? brand, string search, decimal? from, decimal? to, string? sort, int page, int pageSize = 10)
        //{ 

        //    var allPro = _context.Products.AsQueryable();

        //    // Filter by brand if provided
        //    if (!string.IsNullOrEmpty(brand))
        //    {
        //        allPro = allPro.Where(h => h.Brand.BrandName.Contains(brand));
        //    }

        //    // Filter and search
        //    if (!string.IsNullOrEmpty(search))
        //    {
        //        allPro = allPro.Where(h => h.ProductName.Contains(search));
        //    }
        //    if (from.HasValue)
        //    {
        //        allPro = allPro.Where(h => h.SellPrice >= from);
        //    }
        //    if (to.HasValue)
        //    {
        //        allPro = allPro.Where(h => h.SellPrice <= to);
        //    }

        //    // Sorting
        //    // Áp dụng sắp xếp dựa trên `sort` nếu có
        //    if (!string.IsNullOrEmpty(sort))
        //    {
        //        switch (sort)
        //        {
        //            case "gia_esc":  // Giá tăng dần
        //                allPro = allPro.OrderBy(p => p.SellPrice);
        //                break;
        //            case "gia_dsec":  // Giá giảm dần
        //                allPro = allPro.OrderByDescending(p => p.SellPrice);
        //                break;
        //            case "ten_esc":  // Tên sản phẩm tăng dần
        //                allPro = allPro.OrderBy(p => p.ProductName);
        //                break;
        //            default:
        //                allPro = allPro.OrderBy(h => h.ProductName); // Mặc định sắp xếp theo tên sản phẩm tăng dần
        //                break;
        //        }
        //    }
        //    else
        //    {
        //        // Sắp xếp mặc định nếu không có lựa chọn `sort`
        //        allPro = allPro.OrderBy(h => h.ProductName);
        //    }

        //    // Paginate results
        //    var result = PaginatedList<Product>.Create(allPro, page, PAGE_SIZE); // Sử dụng phương thức async cho phân trang
        //    Console.WriteLine($"PageIndex: {result.PageIndex}, TotalPages: {result.TotalPage}, TotalItems: {result.Count}");

        //    // Map results to view models
        //    return result.Select(product => new ProductPMViewModel
        //    {
        //        ProductId = product.ProductId,
        //        BrandId = product.BrandId,
        //        ProductName = product.ProductName,
        //        Title = product.Title,
        //        Description = product.Description,
        //        Color = product.Color,
        //        CostPrice = product.CostPrice,
        //        SellPrice = product.SellPrice,
        //        Stock = product.Stock,
        //        ImageUrl = product.ImageUrl
        //    }).ToList();
        //}

        public async Task<IEnumerable<ProductPMViewModel>> GetAllProductsAsync(
          string? brand, string search, decimal? from, decimal? to, string? sort, int page, int pageSize = 6)
        {
            // Khởi tạo truy vấn từ bảng Products
            var allPro = _context.Products.AsQueryable();

            // Lọc theo thương hiệu nếu có
            if (!string.IsNullOrEmpty(brand))
            {
                allPro = allPro.Where(p => p.Brand.BrandName.Contains(brand));
            }

            // Tìm kiếm theo tên sản phẩm nếu có
            if (!string.IsNullOrEmpty(search))
            {
                allPro = allPro.Where(p => p.ProductName.Contains(search));
            }

            // Lọc theo mức giá nếu có
            if (from.HasValue)
            {
                allPro = allPro.Where(p => p.SellPrice >= from);
            }

            if (to.HasValue)
            {
                allPro = allPro.Where(p => p.SellPrice <= to);
            }

            // Sắp xếp theo các tiêu chí được chỉ định
            if (!string.IsNullOrEmpty(sort))
            {
                switch (sort)
                {
                    case "gia_esc":  // Giá tăng dần
                        allPro = allPro.OrderBy(p => p.SellPrice);
                        break;
                    case "gia_dsec":  // Giá giảm dần
                        allPro = allPro.OrderByDescending(p => p.SellPrice);
                        break;
                    case "ten_esc":  // Tên sản phẩm tăng dần
                        allPro = allPro.OrderBy(p => p.ProductName);
                        break;
                    default:
                        allPro = allPro.OrderBy(p => p.ProductName); // Mặc định theo tên sản phẩm
                        break;
                }
            }
            else
            {
                // Sắp xếp theo tên sản phẩm nếu không có lựa chọn `sort`
                allPro = allPro.OrderBy(p => p.ProductName);
            }

            // Phân trang kết quả
            var result = await PaginatedList<Product>.CreateAsync(allPro, page, pageSize);

            // Ánh xạ dữ liệu sang ProductPMViewModel
            var mappedProducts = result.Items.Select(p => new ProductPMViewModel
            {
                ProductId = p.ProductId,
                BrandId = p.BrandId,
                ProductName = p.ProductName,
                Title = p.Title,
                Description = p.Description,
                Color = p.Color,
                CostPrice = p.CostPrice,
                SellPrice = p.SellPrice,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl
            }).ToList();

            // Trả về kết quả
            return mappedProducts;
        }
        public async Task<int> GetTotalProductCountAsync(string? brand, string search, decimal? from, decimal? to)
        {
            // Khởi tạo truy vấn từ bảng Products
            var query = _context.Products.AsQueryable();

            // Lọc theo thương hiệu nếu có
            if (!string.IsNullOrEmpty(brand))
            {
                query = query.Where(p => p.Brand.BrandName.Contains(brand));
            }

            // Tìm kiếm theo tên sản phẩm nếu có
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.ProductName.Contains(search));
            }

            // Lọc theo mức giá nếu có
            if (from.HasValue)
            {
                query = query.Where(p => p.SellPrice >= from);
            }

            if (to.HasValue)
            {
                query = query.Where(p => p.SellPrice <= to);
            }

            // Đếm số lượng sản phẩm thỏa mãn điều kiện
            return await query.CountAsync();
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

    }
}
