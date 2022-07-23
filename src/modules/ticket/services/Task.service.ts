import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { LessThan } from 'typeorm';

import { StatusInvoice } from '../../../common/constants/statusReceipt';
import { AttendeeRepository, InvoiceRepository } from '../repositories';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);
	constructor(
		private repo: AttendeeRepository,
		private invoiceRepo: InvoiceRepository,
	) {
	}

  @Cron(CronExpression.EVERY_5_MINUTES)
	async handleCron() {
		const date = moment().add(-5, 'h').toDate();
		const attendees = await this.repo.find({
			where: {
				createdAt: LessThan(date),
				invoice: {
					status: StatusInvoice.PENDING
				}

			},
			relations:['invoice']
		});
		const idAtt = attendees.map((attendee) => attendee.id.toValue());
		const idsInvoice = attendees.map((attendee) => attendee.invoice.id.toValue());
		await this.repo.delete(idAtt);
		await this.invoiceRepo.delete(idsInvoice);
	}
}
