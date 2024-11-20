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

        public async Task<IEnumerable<OrderVm>> GetUserByEmail(string email)
        {
            var orderVms = new List<OrderVm>();
            var user = await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
            if (user == null) return null;
            var orders = await _context.Orders.Where(x => x.UserId == user.Id && (x.Status == "Pending" || x.Status == "Completed")).ToListAsync();
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
