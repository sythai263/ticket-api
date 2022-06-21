import { SetMetadata } from '@nestjs/common';

import { RoleType } from '../common/constants/roleType';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
