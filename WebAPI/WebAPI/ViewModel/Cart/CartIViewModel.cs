namespace WebAPI.ViewModel
{
    public class CartIViewModel
    {
        public Guid CartItemId { get; set; }
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
