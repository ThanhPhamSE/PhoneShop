namespace WebAPI.ViewModel.CheckOut
{
    public class OrderVm
    {
        public Guid OrderId { get; set; }
        public Guid UserId { get; set; } // FK đến ApplicationUser
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
    }
}
