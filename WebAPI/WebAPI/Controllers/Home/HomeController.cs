using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository;
using WebAPI.Repository.IRepository;

namespace WebAPI.Controllers.Home
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IHomeRepository _homeRepository;
        public HomeController(IHomeRepository homeRepository)
        {
            _homeRepository = homeRepository;
        }

         [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _homeRepository.GetAllProductsAsync();
            if (products == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "No products found");
            }
            return Ok(products);
        }

        [HttpGet("get-all-products")]
        public async Task<IActionResult> GetAllProducts(
     string? brand, string? search, decimal? from, decimal? to, string? sort, [FromQuery] int page = 1)
        {
            try
            {
                // Gọi phương thức từ repository để lấy sản phẩm phân trang
                var products = await _homeRepository.GetAllProductsAsync(brand, search, from, to, sort, page);

                // Tính tổng số sản phẩm (để xác định số trang)
                var totalProducts = await _homeRepository.GetTotalProductCountAsync(brand, search, from, to);

                // Tính tổng số trang
                var totalPages = (int)Math.Ceiling((double)totalProducts / 6);  // pageSize mặc định là 6

                // Trả về kết quả với status code 200 (OK)
                return Ok(new
                {
                    products = products,    // Sản phẩm trong trang hiện tại
                    page = page,            // Trang hiện tại
                    totalPages = totalPages // Tổng số trang
                });
            }
            catch (Exception ex)
            {
                // Trả về lỗi với thông báo BadRequest nếu có lỗi
                return BadRequest(ex.Message);
            }
        }




        [HttpGet("get-product-by-id/{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var product = await _homeRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Product not found");
            }
            return Ok(product);
        }

        [HttpGet("get-all-brands")]
        public async Task<IActionResult> GetAllBrands()
        {
            var brands = await _homeRepository.GetAllBrandsAsync();
            if (brands == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "No brands found");
            }
            return Ok(brands);
        }

        [HttpGet("get-brand-by-id/{id}")]
        public async Task<IActionResult> GetBrandById(Guid id)
        {
            var brand = await _homeRepository.GetBrandByIdAsync(id);
            if (brand == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Brand not found");
            }
            return Ok(brand);
        }
    }
}
