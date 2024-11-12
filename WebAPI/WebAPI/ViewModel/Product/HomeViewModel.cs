namespace WebAPI.ViewModel.Product
{
    public class HomeViewModel
    {
        public IEnumerable<BrandViewModels> Brands { get; set; }
        public IEnumerable<ProductViewModels> Products { get; set; }

        // Các tham số lọc
        public string SelectedBrand { get; set; }
        public string SelectedColor { get; set; }
        public string SelectedPriceRange { get; set; }
    }
}
