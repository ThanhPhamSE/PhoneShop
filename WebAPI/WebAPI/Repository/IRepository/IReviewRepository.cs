using WebAPI.ViewModel.ProductDetail;

namespace WebAPI.Repository
{
    public interface IReviewRepository
    {
        Task<IEnumerable<ReviewViewModel>> GetReviewsByProductIdAsync(Guid productId);
    }
}
