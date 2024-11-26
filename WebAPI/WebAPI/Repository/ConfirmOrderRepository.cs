using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel;
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

        public async Task<bool> AddOrder(OrderVm orderVm)
        {
            var order = new Order()
            {
                OrderId = orderVm.OrderId,
                UserId = orderVm.UserId,
                OrderDate = orderVm.OrderDate,
                TotalAmount = orderVm.TotalAmount,
                Status = orderVm.Status
            };
            await _context.Orders.AddAsync(order);
            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<bool> AddOrderItem(OrderItemViewModel orderItemViewModel)
        {
           var item = new OrderItem() 
           {
               OrderItemId = orderItemViewModel.OrderItemId,
               OrderId = orderItemViewModel.OrderId,
               ProductId = orderItemViewModel.ProductId,
               Quantity = orderItemViewModel.Quantity,
               Price = orderItemViewModel.Price,
               Consignee = orderItemViewModel.Consignee
           };
            await _context.OrderItems.AddAsync(item);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AddressUser(AddressViewModel address)
        {
            var addressObj = new Address()
            {
                UserId = address.UserId,
                City = address.City,
                District = address.District,
                Village = address.Village,
                Description = address.Description
            };
            await _context.Addresses.AddAsync(addressObj);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<AddressViewModel> GetAddressByEmail(string email)
        {
            var user = await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
            if (user == null) return null;
            var address = await _context.Addresses.Where(x => x.UserId == user.Id).FirstOrDefaultAsync();
            if (address == null) return new AddressViewModel();
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

        public async Task<UserVm> GetUserByEmail(string email)
        {
           var user = await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
            if (user == null) return null;
            var userVm = new UserVm()
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };
            return userVm;
        }

        public async Task<bool> UpdateAddress(AddressViewModel address)
        {
            var addressObj = await _context.Addresses.Where(x => x.UserId == address.UserId).FirstOrDefaultAsync();
            if (addressObj == null) return false;
            addressObj.City = address.City;
            addressObj.District = address.District;
            addressObj.Village = address.Village;
            addressObj.Description = address.Description;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateQuantityAfterPlaceOrder(Guid productId, int quantity)
        {
            var product = await _context.Products.Where(x => x.ProductId == productId).FirstOrDefaultAsync();
            if (product == null) return false;
            if (product.Stock < quantity) return false;
            product.Stock -= quantity;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateQuantityAfterPlaceOrder(ProductPMViewModel product)
        {
            var productObj = await _context.Products.Where(x => x.ProductId == product.ProductId).FirstOrDefaultAsync();
            if (productObj == null) return false;
            productObj.Stock = product.Stock;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
