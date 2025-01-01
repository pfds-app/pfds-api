import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Dummy } from "src/model";
import { HealthService } from "src/service";
import { ApiJfds, ApiPagination } from "../docs/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Authenticated } from "src/auth/decorators";

@Controller()
@ApiTags("Health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("/ping")
  @ApiOperation({
    operationId: "ping",
  })
  @ApiOkResponse({
    content: {
      "text/plain": {
        schema: {
          type: "string",
        },
      },
    },
  })
  async ping() {
    return "pong";
  }

  @Get("/dummies")
  @ApiPagination()
  @ApiJfds({ operationId: "getDummies", type: [Dummy] })
  async getDummies(
    @Pagination() pagination: PaginationParams
  ): Promise<Dummy[]> {
    return this.healthService.getDummies(pagination);
  }

  @Get("/dummies/private")
  @Authenticated()
  @ApiPagination()
  @ApiJfds({ operationId: "getPrivateDummies", type: [Dummy] })
  async getPrivateDummies(@Pagination() pagination: PaginationParams) {
    return this.healthService.getDummies(pagination);
  }
}
