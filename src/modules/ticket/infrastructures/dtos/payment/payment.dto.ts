/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
export class PaymentDto{
	vnp_Amount: string;
	vnp_Command: string;
	vnp_CreateDate: string;
	vnp_CurrCode: string;
	vnp_IpAddr: string | string[];
	vnp_Locale: string;
	vnp_OrderInfo: string;
	vnp_OrderType: string;
	vnp_ReturnUrl: string;
	vnp_TmnCode: string;
	vnp_TxnRef: string;
	vnp_Version: string;
	vnp_SecureHash: string;

	constructor(
		tmnCode?: string,
		txnRef?: string,
		orderInfo?: string,
		amount?: string,
		returnUrl?: string,
		createDate?: string,
		ipAddr?: string | string[],
	) {
		this.vnp_Amount = amount;
		this.vnp_Command = 'pay';
		this.vnp_CreateDate = createDate;
		this.vnp_CurrCode = 'VND';
		this.vnp_IpAddr = ipAddr;
		this.vnp_Locale = 'vn';
		this.vnp_OrderInfo = orderInfo;
		this.vnp_OrderType= 'billpayment';
		this.vnp_ReturnUrl = returnUrl;
		this.vnp_TmnCode = tmnCode;
		this.vnp_TxnRef = txnRef;
		this.vnp_Version = '2.1.0';
	}

}
