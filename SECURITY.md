
# Security Policy for Kuhiro Weather App

## Supported Versions

The following versions of the Kuhiro Weather App are currently supported with security updates:

| Version | Supported          |
|---------|--------------------|
| 1.x.x   | ✅                 |
| < 1.0   | ❌                 |

## Reporting a Vulnerability

We take the security of **Kuhiro** seriously. If you discover a security vulnerability, please report it responsibly by following these steps:

1. **Do not** disclose the vulnerability publicly (e.g., on GitHub issues, social media, or other public platforms) until it has been addressed.
2. Contact the project maintainer directly via email at: **security@mridulkhanal.dev** with a detailed description of the vulnerability.
3. Include the following in your report:
   - A clear description of the vulnerability and its potential impact.
   - Steps to reproduce the issue, if possible.
   - Any relevant logs, screenshots, or code snippets.
4. Allow reasonable time for us to investigate and address the issue. We aim to acknowledge reports within 48 hours and provide updates on progress.

## Security Measures in Place

The Kuhiro Weather App implements several security practices to protect users and their data:

- **Frontend Security**:
  - Built with **React.js** and **TypeScript** to ensure type-safe code and reduce runtime errors.
  - Uses **HTTPS** for all API communications to prevent man-in-the-middle attacks.
  - Implements input sanitization to prevent XSS (Cross-Site Scripting) attacks.
  - Stores sensitive data (e.g., quiz high scores) securely in **localStorage** with no sensitive user information exposed.

- **Backend Security**:
  - Built with **Django** and **Django REST Framework**, leveraging Django’s built-in security features (e.g., CSRF protection, SQL injection prevention).
  - Configured **CORS** to allow only trusted origins (e.g., `http://localhost:5173` during development).
  - Uses **SQLite** in development with plans to upgrade to **PostgreSQL** for production, ensuring secure database configurations.
  - API endpoints are protected against unauthorized access using proper authentication mechanisms (to be implemented for quiz leaderboard submissions).

- **API Security**:
  - Integrates **OpenWeatherMap API** using secure API keys stored in environment variables (not hardcoded).
  - Custom Django APIs for feedback and quiz data validate inputs to prevent injection attacks.
  - Rate limiting planned for production to prevent abuse of API endpoints.

- **Dependency Management**:
  - Regularly updates dependencies (e.g., Node.js packages, Python libraries) to patch known vulnerabilities.
  - Uses `npm audit` and `pip-audit` to monitor for vulnerabilities in dependencies.

## Known Security Considerations

- **OpenWeatherMap API**: Relies on third-party API for weather data. Ensure your API key is kept secure and not exposed in client-side code.
- **Offline Mode**: Cached data in localStorage is not encrypted. Avoid storing sensitive user data in the cache.
- **Quiz Leaderboard**: Currently, leaderboard scores are stored locally and planned for backend integration. Ensure proper authentication and validation when submitting scores to prevent tampering.

## Responsible Disclosure Process

1. **Report Received**: We acknowledge your report within 48 hours.
2. **Investigation**: Our team assesses the vulnerability’s severity and impact.
3. **Fix Development**: We prioritize and develop a fix, typically within 7–14 days for critical issues.
4. **Patch Release**: A new version is released with the fix, and supported versions are updated.
5. **Public Disclosure**: After the fix is deployed, we may coordinate with you to publicly disclose the vulnerability (if desired), giving credit unless you prefer anonymity.

## Contact

For security-related concerns, please reach out to:  
📧 **khanalmridul74@gmail.com**

For general inquiries, contact:  
📧 **khanalmridul74@gmail.com**  
🌐 [GitHub](https://github.com/Mridulkhanal)

## Acknowledgments

We appreciate the contributions of security researchers and users who help keep **Kuhiro** secure. Thank you for responsibly reporting issues and helping us improve!