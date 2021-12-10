export interface ICompanyInfo {
	name?: string;
	data?: {
		address?: {
			street?: string;
			city?: string;
			province?: string;
			postalCode?: string;
		};
		email?: string;
		phone?: string;
	};
}
