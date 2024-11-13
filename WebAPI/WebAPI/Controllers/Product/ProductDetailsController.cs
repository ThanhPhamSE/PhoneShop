using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.Product;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductDetailsController : ControllerBase
    {
        private readonly IProductDetailRepository _productRepository;
        private readonly ILogger<ProductDetailsController> _logger;

        public ProductDetailsController(IProductDetailRepository productRepository, ILogger<ProductDetailsController> logger)
        {
            _productRepository = productRepository;
            _logger = logger;
        }

        [HttpGet("product-detail/{productId}")]
        public async Task<ActionResult<ProductViewModels>> GetProductById(Guid productId)
        {
            try
            {
                var product = await _productRepository.GetProductByIdAsync(productId);

                if (product == null)
                {
                    _logger.LogWarning("Product with ID {ProductId} not found.", productId);
                    return NotFound(new { Message = "Product not found" });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting product with ID {ProductId}", productId);
                return StatusCode(500, new { Message = "An error occurred while processing your request." });
            }
        }
    }
}
