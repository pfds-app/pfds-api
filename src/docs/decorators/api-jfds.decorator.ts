import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponseMetadata,
  ApiProperty,
  ApiBadRequestResponse,
  ApiOperationOptions,
} from "@nestjs/swagger";

type ApiJfdsOptions = {
  operationId: string;
  type: ApiResponseMetadata["type"];
  operationOptions?: ApiOperationOptions;
};

class ApiResponseError {
  @ApiProperty()
  private statusCode: number;
  @ApiProperty()
  private message: string;
  @ApiProperty()
  private error: string;
}

export function ApiJfds({
  operationId,
  type,
  operationOptions = {},
}: ApiJfdsOptions) {
  return applyDecorators(
    ApiOperation({ ...operationOptions, operationId }),
    ApiOkResponse({ type }),
    ApiForbiddenResponse({ type: ApiResponseError }),
    ApiInternalServerErrorResponse({ type: ApiResponseError }),
    ApiNotFoundResponse({ type: ApiResponseError }),
    ApiBadRequestResponse({ type: ApiResponseError })
  );
}
