/* eslint-disable max-params */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import { IsString } from 'class-validator';

export class PaymentReturnDto{
	@IsString()
		vnp_Amount: string;

	@IsString()
		vnp_BankCode: string;

	@IsString()
		vnp_BankTranNo: string;

	@IsString()
		vnp_CardType: string;

	@IsString()
		vnp_OrderInfo: string;

	@IsString()
		vnp_PayDate: string;

	@IsString()
		vnp_ResponseCode: string;

	@IsString()
		vnp_TmnCode: string;

	@IsString()
		vnp_TransactionNo: string;

	@IsString()
		vnp_TransactionStatus: string;

	@IsString()
		vnp_TxnRef: string;

	@IsString()
		vnp_SecureHash: string;

	constructor(
		amount: string,
		bankCode: string,
		bankTranNo: string,
		cardType: string,
		orderInfo: string,
		payDate: string,
		responseCode: string,
		tmnCode: string,
		transactionNo: string,
		transactionStatus: string,
		txnRef: string,
	) {
		this.vnp_Amount = amount;
		this.vnp_BankCode = bankCode;
		this.vnp_BankTranNo = bankTranNo;
		this.vnp_CardType = cardType;
		this.vnp_OrderInfo = orderInfo;
		this.vnp_PayDate = payDate;
		this.vnp_ResponseCode = responseCode;
		this.vnp_TmnCode = tmnCode;
		this.vnp_TransactionNo = transactionNo;
		this.vnp_TransactionStatus = transactionStatus;
		this.vnp_TxnRef = txnRef;
	}
}
