import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { buildMongoSearchQuery, SearchOperator } from '@nx-starter/api-models'
import { IUser } from '@nx-starter/shared-models'
import { getPaginationConfig, getSortConfig, SortOrder } from '@nx-starter/shared-utils'
import { AdminGuard } from '../auth/admin.guard'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('')
    async getAll(
        @Query('searchFor') searchFor: keyof IUser | null,
        @Query('searchOperator') searchOperator: SearchOperator = SearchOperator.LIKE,
        @Query('searchTerm') searchTerm: string | null,
        @Query('page') page = 1,
        @Query('size') size = 10,
        @Query('sort') sort = 'createdAt',
        @Query('order') order: SortOrder = SortOrder.DESC,
    ): Promise<IUser[]> {
        const pagination = getPaginationConfig(page, size)
        const sorting = getSortConfig(sort, order)

        const query = buildMongoSearchQuery(searchFor, searchOperator, searchTerm)
        console.log('TCL: UsersController -> constructor -> query', query)

        return this.usersService.find(query, pagination, sorting)
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<IUser> {
        return this.usersService.findById(id)
    }

    @UseGuards(AdminGuard)
    @Post(':id')
    async deactivateUser(@Param('id') id: string): Promise<IUser> {
        return this.usersService.update(id, { isActive: false })
    }

    @UseGuards(AdminGuard)
    @Post(':id')
    async activateUser(@Param('id') id: string): Promise<IUser> {
        return this.usersService.update(id, { isActive: true })
    }
}
