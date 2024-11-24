namespace WebAPI.ViewModel.CheckOut
{
    public class OrderItemViewModel
    {
        public Guid OrderItemId { get; set; }
        public Guid OrderId { get; set; } // FK đến Order
        public Guid ProductId { get; set; } // FK đến Product
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Consignee { get; set; }
    }
}
