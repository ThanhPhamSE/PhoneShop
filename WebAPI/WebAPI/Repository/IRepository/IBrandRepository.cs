using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface IBrandRepository
    {
        Task<Brand> CreateAsync(Brand brand);

        Task<IEnumerable<Brand>> GetAllAsync();

        Task<Brand?> GetById(Guid id);

        Task<Brand?> UpdateAsync(Brand brand);

        Task<Brand?> DeleteAsync(Guid id);
    }
}
