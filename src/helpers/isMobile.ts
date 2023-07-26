export const isMobile = {
	Android: function (): boolean {
		return !!navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function (): boolean {
		return !!navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function (): boolean {
		return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function (): boolean {
		return !!navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function (): boolean {
		return !!navigator.userAgent.match(/IEMobile/i) || !!navigator.userAgent.match(/WPDesktop/i);
	},
	any: function (): boolean {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		);
	},
};
