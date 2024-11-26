import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetailService } from '../user-detail/services/user-detail.service';
import { ReviewUserService } from '../add-review/service/review-user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../user-detail/models/user';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {
  isLoggedIn = false;
  reviewData = {
    rating: 1,
    comment: ''
  };
  stars = [1, 2, 3, 4, 5];
  productId: string = '';
  userId: string | null = null;
  userEmail: string | null = localStorage.getItem('user-email');

  constructor(
    private authService: UserDetailService,
    private productService: ReviewUserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus(); // Lấy trạng thái và ID người dùng
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('productId') || '';
      console.log('Product ID from URL:', this.productId);
      console.log('UserId:', this.userId);
      console.log('UserEmail:', this.userEmail);
    });
  }

  // Cập nhật trong checkLoginStatus để lấy userId từ API
  checkLoginStatus(): void {
    const userEmail = localStorage.getItem('user-email');
    if (userEmail) {
      this.authService.getUserByEmail(userEmail).subscribe(
        (response) => {
          console.log('API response:', response);
          if (response && response.user) {
            this.isLoggedIn = true;
            this.userId = response.user.userId;
            console.log('UserId fetched from API:', this.userId);
          } else {
            this.isLoggedIn = false;
            console.error('User not found or invalid response');
          }
        },
        (error) => {
          this.isLoggedIn = false;
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      this.isLoggedIn = false;
      console.error('No email found in localStorage');
    }
  }

  // Xử lý sự kiện khi người dùng click vào ngôi sao
  onStarClick(rating: number): void {
    this.reviewData.rating = rating;
  }
  submitReview(): void {
    if (this.isLoggedIn && this.productId && this.userId) {
      const reviewPayload = {
        userId: this.userId,
        rating: this.reviewData.rating,
        comment: this.reviewData.comment.trim(),
      };

      console.log('Sending review payload:', reviewPayload);

      this.productService.addReview(this.productId, reviewPayload).subscribe(
        (response) => {
          console.log('Review added successfully:', response);
          this.router.navigate(['/product-detail', this.productId]);
        },
        (error) => {
          console.error('Failed to add review:', error.error?.errors || error.message);
          alert('Failed to add review. Please check your input.');
        }
      );
    } else {
      alert('Please log in to add a review');
    }
  }

}
