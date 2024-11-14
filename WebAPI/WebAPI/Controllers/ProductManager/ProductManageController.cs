using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository;
using WebAPI.ViewModel;

namespace WebAPI.Controllers.ProductManage
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductManageController : ControllerBase
    {
        private readonly IProductManageRepository _productManageRepository;
        public ProductManageController(IProductManageRepository productManageRepository)
        {
            _productManageRepository = productManageRepository;
        }

        [HttpGet("get-all-products")]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productManageRepository.GetAllProductsAsync();
            if (products == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "No products found");
            }
            return Ok(products);
        }

        [HttpGet("get-product-by-id/{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var product = await _productManageRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Product not found");
            }
            return Ok(product);
        }

        [HttpPost("add-product")]
        public async Task<IActionResult> AddProduct([FromBody] ProductPMViewModel productVm)
        {
            var result = await _productManageRepository.CreateProductAsync(productVm);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create product");
            }
            return Ok(result);
        }

        [HttpPut("update-product-by-id/{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ProductPMViewModel productVm)
        {
            var result = await _productManageRepository.UpdateProductAsync(id, productVm);
            if (result == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update product");
            }
            else if (result == -1)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Product not found");
            }
            return Ok(result);
        }

        [HttpDelete("delete-product-by-id/{id}")]
        public async Task<IActionResult> DeleteProductById(Guid id)
        {
            var result = await _productManageRepository.DeleteProductAsync(id);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete product");
            }
            return Ok(result);
        }

        [HttpGet("get-all-brands")]
        public async Task<IActionResult> GetAllBrands()
        {
            var brands = await _productManageRepository.GetAllBrandsAsync();
            if (brands == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "No brands found");
            }
            return Ok(brands);
        }

        [HttpGet("get-brand-by-id/{id}")]
        public async Task<IActionResult> GetBrandById(Guid id)
        {
            var brand = await _productManageRepository.GetBrandByIdAsync(id);
            if (brand == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Brand not found");
            }
            return Ok(brand);
        }
    }
}
