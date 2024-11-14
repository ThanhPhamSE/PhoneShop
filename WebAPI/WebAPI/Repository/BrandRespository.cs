using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public class BrandRespository
    {
        public class BrandRepository : IBrandRepository
        {
            private readonly AppDBContext _context;

            public BrandRepository(AppDBContext context)
            {
                _context = context;
            }

            public async Task<IEnumerable<Brand>> GetAllAsync()
            {
                return await _context.Brands.ToListAsync();
            }

            public async Task<Brand?> GetById(Guid id)
            {
                return await _context.Brands.FirstOrDefaultAsync(b => b.BrandId == id);
            }

            public async Task<Brand> CreateAsync(Brand brand)
            {


                await _context.Brands.AddAsync(brand);
                await _context.SaveChangesAsync();
                return brand;
            }

            public async Task<Brand?> UpdateAsync(Brand brand)
            {
                var existingBrand = await _context.Brands.FirstOrDefaultAsync(b => b.BrandId == brand.BrandId);
                if (existingBrand != null)
                {
                    _context.Entry(existingBrand).CurrentValues.SetValues(brand);

                    await _context.SaveChangesAsync();
                    return brand;
                }
                return null;
            }

            public async Task<Brand?> DeleteAsync(Guid id)
            {
                var existingBrand = await _context.Brands.FirstOrDefaultAsync(b => b.BrandId == id);
                if (existingBrand != null)
                {
                    _context.Brands.Remove(existingBrand);
                    await _context.SaveChangesAsync();
                    return existingBrand;
                }
                return null;
            }
        }
    }
}
