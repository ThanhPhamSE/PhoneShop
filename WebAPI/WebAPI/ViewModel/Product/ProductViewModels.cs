namespace WebAPI.ViewModel.Product
{
    public class ProductViewModels
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SellPrice { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; }
        public Guid BrandId { get; set; }
        public string BrandName { get; set; }  // Tên thương hiệu

        // Thêm logic để trả về mức giá
        public string PriceRange
        {
            get
            {
                // Lọc giá theo các mức giá đã được định nghĩa
                if (SellPrice > 1000) return "Cao";
                if (SellPrice >= 500 && SellPrice <= 1000) return "Trung bình";
                return "Rẻ";
            }
        }
    }
}
