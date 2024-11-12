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
                // Lấy tất cả sản phẩm từ cơ sở dữ liệu
                var products = await _homeRepository.GetAllProductsAsync();

                // Trả về danh sách sản phẩm
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
        public async Task<IActionResult> GetFilteredProducts([FromQuery] string? brandName, [FromQuery] string? color)
        {
            try
            {
                // Lấy danh sách sản phẩm đã lọc theo các tham số truyền vào
                var products = await _homeRepository.GetAllProductsAsync(brandName, color);

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
