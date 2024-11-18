using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository;
using WebAPI.Repository.IRepository;

namespace WebAPI.Controllers.ProductDetail
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductDetailController : ControllerBase
    {
        private readonly IProductDetailRepository _productDetailRepository;
        private readonly IReviewRepository _reviewRepository;
        public ProductDetailController(IProductDetailRepository productDetailRepository, IReviewRepository reviewRepository)
        {
            _productDetailRepository = productDetailRepository;
            _reviewRepository = reviewRepository;
        }

        [HttpGet("get-product-by-id/{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var product = await _productDetailRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Product not found");
            }
            return Ok(product);
        }

        [HttpGet("get-reviews-by-product-id/{productId}")]
        public async Task<IActionResult> GetReviewsByProductId(Guid productId)
        {
            var reviews = await _reviewRepository.GetReviewsByProductIdAsync(productId);
            if (reviews == null)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá cho sản phẩm này." });
            }

            return Ok(reviews);
        }


    }
}
