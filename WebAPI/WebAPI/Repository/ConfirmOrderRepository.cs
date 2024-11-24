using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.CheckOut;

namespace WebAPI.Repository
{
    public class ConfirmOrderRepository : IConfirmOrderRepository
    {
        private readonly AppDBContext _context;
        public ConfirmOrderRepository(AppDBContext context)
        {
            _context = context;
        }
        public async Task<AddressViewModel> GetAddressByEmail(string email)
        {
            var user = await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
            if (user == null) return null;
            var address = await _context.Addresses.Where(x => x.UserId == user.Id).FirstOrDefaultAsync();
            var addressVm = new AddressViewModel()
            {
                AddressId = address.AddressId,
                UserId = address.UserId,
                City = address.City,
                District = address.District,
                Village = address.Village,
                Description = address.Description
            };
            return addressVm;
        }
    }
}
