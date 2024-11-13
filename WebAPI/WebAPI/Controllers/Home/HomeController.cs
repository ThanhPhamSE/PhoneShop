using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.Product;
using Microsoft.Extensions.Logging;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IHomeRepository _homeRepository;
        private readonly ILogger<HomeController> _logger;

        public HomeController(IHomeRepository homeRepository, ILogger<HomeController> logger)
        {
            _homeRepository = homeRepository;
            _logger = logger;
        }
        [HttpGet("products")]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                // Lấy tất cả sản phẩm từ repository
                var products = await _homeRepository.GetAllProductsAsync();

                // Phân trang trong bộ nhớ
                //var pagedProducts = products
                //    .Skip((pageNumber - 1) * pageSize)
                //    .Take(pageSize)
                //    .ToList();

                // Trả về sản phẩm đã phân trang
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi server
                _logger.LogError($"An error occurred while fetching all products: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }


        [HttpGet("products/filter")]
        public async Task<IActionResult> GetFilteredProducts([FromQuery] string? brandName, [FromQuery] string? color, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 18)
        {
            try
            {
                // Lấy danh sách sản phẩm đã lọc theo các tham số truyền vào
                var products = await _homeRepository.GetAllProductsAsync(brandName, color,pageNumber,pageSize);

                // Trả về danh sách sản phẩm đã lọc
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi server
                _logger.LogError($"An error occurred while fetching filtered products: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }






    }
}
