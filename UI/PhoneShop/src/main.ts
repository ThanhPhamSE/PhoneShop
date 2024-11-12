import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Sử dụng provideHttpClient
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers, // Giữ nguyên các provider trong appConfig
    provideHttpClient()      // Thêm provideHttpClient vào providers
  ]
})
  .catch((err) => console.error(err));
