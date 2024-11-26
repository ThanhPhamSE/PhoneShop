using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.ViewModel;
using WebAPI.ViewModel.CheckOut;

namespace WebAPI.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDBContext _context;
        public OrderRepository(AppDBContext context)
        {
            _context = context;
        }
        public async Task<bool> ChangeStatusOrder(Guid orderId, string status)
        {
             var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return false;
            order.Status = status;
            var result = await _context.SaveChangesAsync() > 0;
            return result;
        }

        public async Task<AddressViewModel> GetAddressByUserId(Guid userId)
        {
            var address = await _context.Addresses.Where(x => x.UserId == userId).FirstOrDefaultAsync();
            if (address == null) return null;
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

        public async Task<IEnumerable<OrderVm>> GetAlls()
        {
            var orders =  await _context.Orders.ToListAsync();
            var orderVms = new List<OrderVm>();
            foreach (var order in orders)
            {
                var orderVm = new OrderVm()
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate.Date,
                    Status = order.Status,
                    TotalAmount = order.TotalAmount,
                    UserId = order.UserId
                };
                orderVms.Add(orderVm);
            }
            return orderVms;
        }

        public async Task<OrderVm> GetOrderById(Guid Id)
        {
            var order = await _context.Orders.FindAsync(Id);
            if (order == null) return null;
            var orderVm = new OrderVm()
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate.Date,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                UserId = order.UserId
            };
            return orderVm;
        }

        public async Task<IEnumerable<OrderVm>> GetOrderByStatus(string status)
        {
            var orders = await _context.Orders.Where(x => x.Status == status).ToListAsync();
            var orderVms = new List<OrderVm>();
            foreach (var order in orders)
            {
                var orderVm = new OrderVm()
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate.Date,
                    Status = order.Status,
                    TotalAmount = order.TotalAmount,
                    UserId = order.UserId
                };
                orderVms.Add(orderVm);
            }
            return orderVms;
        }

        public async Task<IEnumerable<OrderItemViewModel>> GetOrderItemsByOrderId(Guid orderId)
        {
            var orderItems = await _context.OrderItems.Where(x => x.OrderId == orderId).ToListAsync();
            var orderItemVms = new List<OrderItemViewModel>();
            foreach (var orderItem in orderItems)
            {
                var orderItemVm = new OrderItemViewModel()
                {
                    OrderItemId = orderItem.OrderItemId,
                    OrderId = orderItem.OrderId,
                    ProductId = orderItem.ProductId,
                    Quantity = orderItem.Quantity,
                    Price = orderItem.Price,
                    Consignee = orderItem.Consignee
                };
                orderItemVms.Add(orderItemVm);
            }
            return orderItemVms;
        }

        public async Task<ProductPMViewModel> GetProductById(Guid productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return null;
            var productVm = new ProductPMViewModel()
            {
                ProductId = product.ProductId,
                BrandId = product.BrandId,
                ProductName = product.ProductName,
                Title = product.Title,
                Description = product.Description,
                Color = product.Color,
                CostPrice = product.CostPrice,
                SellPrice = product.SellPrice,
                Stock = product.Stock,
                ImageUrl = product.ImageUrl
            };
            return productVm;
        }

        public async Task<IEnumerable<OrderVm>> GetUserByEmail(string email)
        {
            var orderVms = new List<OrderVm>();
            var user = await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
            if (user == null) return null;
            var orders = await _context.Orders.Where(x => x.UserId == user.Id && (x.Status == "Pending" || x.Status == "Completed" || x.Status == "Shipping")).ToListAsync();
            foreach (var order in orders)
            {
                var orderVm = new OrderVm()
                {
                    OrderId = order.OrderId,
                    OrderDate = order.OrderDate.Date,
                    Status = order.Status,
                    TotalAmount = order.TotalAmount,
                    UserId = order.UserId
                };
                orderVms.Add(orderVm);
            }
            return orderVms;
        }


        public async Task<UserVm> GetUserById(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;
            var userVm = new UserVm()
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };
            return userVm;
        }
    }
}
