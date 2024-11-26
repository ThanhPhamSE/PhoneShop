using WebAPI.Data;
using WebAPI.Models;
using WebAPI.ViewModel;

namespace WebAPI.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDBContext _context;
        public CartRepository(AppDBContext context)
        {
            _context = context;
        }
        public async Task<bool> AddCartItemAsync(string userEmail, Guid productd, int quantity)
        {
            var userId = _context.Users.FirstOrDefault(u => u.Email == userEmail).Id;
            var cartItem = _context.CartItems.FirstOrDefault(ci => ci.UserId == userId && ci.ProductId == productd);
            if (cartItem == null)
            {
                cartItem = new CartItem
                {
                    CartItemId = Guid.NewGuid(),
                    UserId = userId,
                    ProductId = productd,
                    Quantity = quantity
                };
                await _context.CartItems.AddAsync(cartItem);
            }
            else
            {
                cartItem.Quantity += quantity;
            }
            bool isCreated = await _context.SaveChangesAsync() > 0;
            return isCreated;
        }

        public async Task<bool> ClearCartAsync(string email)
        {
            var userId = _context.Users.FirstOrDefault(u => u.Email == email).Id;
            var cartItems = _context.CartItems.Where(ci => ci.UserId == userId);
            _context.CartItems.RemoveRange(cartItems);
            bool isDeleted = await _context.SaveChangesAsync() > 0;
            return isDeleted;
        }

        public async Task<bool> DeleteCartItemAsync(Guid cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return false;
            }
            else
            {
                _context.CartItems.Remove(cartItem);
                bool isDeleted = await _context.SaveChangesAsync() > 0;
                return isDeleted;
            }
        }

        public async Task<CartIViewModel> GetCartItemAsync(Guid cartItemId)
        {
            var carItem = await _context.CartItems.FindAsync(cartItemId);
            if (carItem == null)
            {
                return null;
            }
            CartIViewModel cartVM = new CartIViewModel
            {
                CartItemId = carItem.CartItemId,
                UserId = carItem.UserId,
                ProductId = carItem.ProductId,
                Quantity = carItem.Quantity
            };
            return cartVM;
        }

        public async Task<IEnumerable<CartIViewModel>> GetCartItemsByUserIdAsync(string userEmail)
        {
            var userId = _context.Users.FirstOrDefault(u => u.Email == userEmail).Id;
            var cartItems = _context.CartItems.Where(ci => ci.UserId == userId);
            List<CartIViewModel> cartVMs = new List<CartIViewModel>();
            foreach (var cartItem in cartItems)
            {
                cartVMs.Add(new CartIViewModel
                {
                    CartItemId = cartItem.CartItemId,
                    UserId = cartItem.UserId,
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity
                });
            }
            return cartVMs;
        }

        public async Task<bool> UpdateQuantityCartItemAsync(Guid cartId, int one)
        {
            var cartItem = await _context.CartItems.FindAsync(cartId);
            if (cartItem == null)
            {
                return false;
            }
            else
            {
                cartItem.Quantity += one;
                bool isUpdated = await _context.SaveChangesAsync() > 0;
                return isUpdated;
            }
        }
    }
}
