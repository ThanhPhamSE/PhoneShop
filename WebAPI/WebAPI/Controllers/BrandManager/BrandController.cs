using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using WebAPI.Repository;
using WebAPI.ViewModel;

namespace WebAPI.Controllers.BrandManage
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandRepository _brandRepository;

        public BrandController(IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
        }

        // Get all brands
        [HttpGet]
        public async Task<IActionResult> GetAllBrands()
        {
            var brands = await _brandRepository.GetAllAsync();

            var response = new List<BrandViewModels>();

            foreach (var brand in brands)
            {
                response.Add(new BrandViewModels
                {
                    BrandId = brand.BrandId,
                    BrandName = brand.BrandName,
                    Description = brand.Description
                });
            }

            return Ok(response);
        }

        // Get a brand by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrandById(Guid id)
        {
            var brand = await _brandRepository.GetById(id);
            if (brand == null)
            {
                return NotFound();
            }

            var response = new BrandViewModels
            {
                BrandName = brand.BrandName,
                Description = brand.Description
            };

            return Ok(response);
        }

        // Add a new brand
        [HttpPost]
        public async Task<IActionResult> AddBrand([FromBody] CreateBrandRequestViewModel brandViewModel)
        {
            if (brandViewModel == null)
            {
                return BadRequest();
            }

            var brand = new Brand
            {
                BrandName = brandViewModel.BrandName,
                Description = brandViewModel.Description
            };

            await _brandRepository.CreateAsync(brand);

            var response = new BrandViewModels
            {
                BrandName = brand.BrandName,
                Description = brand.Description
            };

            return CreatedAtAction(nameof(GetBrandById), new { id = brand.BrandId }, response);
        }

        // Update an existing brand
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand(Guid id, [FromBody] CreateBrandRequestViewModel brandViewModel)
        {
            if (brandViewModel == null)
            {
                return BadRequest();
            }

            var updatedBrand = new Brand
            {
                BrandId = id,
                BrandName = brandViewModel.BrandName,
                Description = brandViewModel.Description
            };

            var brand = await _brandRepository.UpdateAsync(updatedBrand);

            if (brand == null)
            {
                return NotFound();
            }

            var response = new BrandViewModels
            {
                BrandName = brand.BrandName,
                Description = brand.Description
            };

            return Ok(response);
        }

        // Delete a brand
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(Guid id)
        {
            var brand = await _brandRepository.DeleteAsync(id);
            if (brand == null)
            {
                return NotFound();
            }

            var response = new BrandViewModels
            {
                BrandName = brand.BrandName,
                Description = brand.Description
            };

            return Ok(response);
        }
    }
}
