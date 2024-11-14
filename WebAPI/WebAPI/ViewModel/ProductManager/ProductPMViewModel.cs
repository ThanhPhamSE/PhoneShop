namespace WebAPI.ViewModel
{
    public class ProductPMViewModel
    {
        public Guid ProductId { get; set; }
        public Guid BrandId { get; set; }
        public string ProductName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SellPrice { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; }
    }
}
