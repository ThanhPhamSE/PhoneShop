namespace WebAPI.Models
{
    public class Product
    {
        public Guid ProductId { get; set; }
        public Guid BrandId { get; set; } // FK đến Brand
        public string ProductName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SellPrice { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; }

        public Brand Brand { get; set; }

        // Quan hệ 1-n với CartItem
        public ICollection<CartItem> CartItems { get; set; }

        // Quan hệ 1-n với OrderItem
        public ICollection<OrderItem> OrderItems { get; set; }

        // Quan hệ 1-n với Review
        public ICollection<Review> Reviews { get; set; }
    }
}
