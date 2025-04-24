PageSpeed Dashboard
A React.js single-page application developed during a three-month internship at Mumble S.R.L. (2022). The app analyzes website performance using the Google PageSpeed Insights API, providing developers with actionable metrics and visualizations.
🚀 Features

Test creation and result visualization for website performance
Integration with Google PageSpeed Insights API (FCP, LCP, CLS)
Responsive UI with Material UI and Tailwind CSS
Performance history charts using Chart.js
Secure user authentication with Laravel Sanctum

🛠 Tech Stack

Frontend: React.js, Material UI, Tailwind CSS, SASS, BEM
Backend: Laravel, MySQL
APIs: Google PageSpeed Insights, Axios
DevOps: Docker, Terraform, AWS EC2
Tools: Chart.js, Visual Studio Code

📦 To Start

- Download
- Run npm install
- Run command
     ```
      docker run --rm \
      -v $(pwd):/opt \
      -w /opt \
      laravelsail/php80-composer:latest \
      composer install
  ```
- add .env file.  Can copy the .env.example.
    - APP_KEY=[YOUR APP KEY]
    - APP_URL=[YOUR APP URL] (i.e. http://laravel-react.test)
    - DB_HOST=mysql
    - REDIS_HOST=reeds
- run one of the npm scripts (npm run watch)
- sail up (install Docker before this if you don't have it.)


📝 Lessons Learned

Built dynamic SPAs with React.js
Integrated REST APIs using Axios
Applied DevOps practices with Docker and Terraform

📫 Contact

Email: jacopo.jop@gmail.com
LinkedIn: linkedin.com/in/jacopo-jop

Built with 💻 and 🐝 by Jacopo Jop
