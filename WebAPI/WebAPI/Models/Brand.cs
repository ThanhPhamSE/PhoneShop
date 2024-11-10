namespace WebAPI.Models
{
    public class Brand
    {
        public Guid BrandId { get; set; }
        public string BrandName { get; set; }
        public string Description { get; set; }

        // Quan hệ 1-n với Product
        public ICollection<Product> Products { get; set; }
    }
}
