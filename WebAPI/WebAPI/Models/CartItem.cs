namespace WebAPI.Models
{
    public class CartItem
    {
        public Guid CartItemId { get; set; }
        public Guid UserId { get; set; } // FK đến ApplicationUser
        public Guid ProductId { get; set; } // FK đến Product
        public int Quantity { get; set; }
        public User User { get; set; }
        public Product Product { get; set; }
    }
}
