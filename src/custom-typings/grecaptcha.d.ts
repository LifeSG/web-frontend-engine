// Minimal type declarations for the reCAPTCHA v3 Enterprise API
declare namespace grecaptcha {
	namespace enterprise {
		function ready(callback: () => void): void;
		function execute(siteKey: string, options: { action: string }): Promise<string>;
	}
}

interface Window {
	grecaptcha?: typeof grecaptcha;
}
