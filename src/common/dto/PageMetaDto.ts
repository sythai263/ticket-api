import { ApiProperty } from '@nestjs/swagger'

import { PageOptionsDto } from './PageOptionsDto'
export class PageMetaDto {
  @ApiProperty()
    page: number

  @ApiProperty()
    take: number

  @ApiProperty()
    itemCount: number

  @ApiProperty()
    pageCount: number

  @ApiProperty()
    hasPreviousPage: boolean

  @ApiProperty()
    hasNextPage: boolean

  constructor (pageOptionsDto: PageOptionsDto, itemCount: number) {
    this.page = pageOptionsDto.page
    this.take = pageOptionsDto.take
    this.itemCount = itemCount
    this.pageCount = Math.ceil(itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}
