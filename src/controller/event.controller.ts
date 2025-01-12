import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import { ApiCriteria, ApiJfds, ApiPagination } from "src/docs/decorators";
import { EventService } from "src/service";
import { Authenticated } from "src/auth/decorators";
import { Pagination, PaginationParams } from "./decorators";
import { Event } from "./rest";
import { EventMapper } from "./mapper";
import { MoreThanOrEqual } from "typeorm";

@Controller()
@ApiTags("Resources")
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventMapper: EventMapper
  ) {}

  @Get("/events")
  @ApiPagination()
  @Authenticated()
  @ApiCriteria(
    { name: "name", type: "string" },
    { name: "afterDate", type: "string", format: "date" }
  )
  @ApiJfds({
    operationId: "getEvents",
    type: [Event],
  })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Query("name") name?: string,
    @Query("afterDate") afterDate?: string
  ) {
    const events = await this.eventService.findAll(pagination, {
      name,
      beginDate: afterDate ? MoreThanOrEqual(afterDate) : undefined,
    });
    return Promise.all(events.map((role) => this.eventMapper.toRest(role)));
  }

  @Get("/events/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "getEventById",
    type: Event,
  })
  async findById(@Param("id") id: string) {
    const event = await this.eventService.findById(id);
    if (!event) {
      throw new NotFoundException();
    }
    return this.eventMapper.toRest(event);
  }

  @Put("/events")
  @Authenticated()
  @ApiBody({ type: [Event] })
  @ApiJfds({
    operationId: "crupdateEvents",
    type: [Event],
  })
  async crupdateEvents(@Body() events: Event[]) {
    const mapped = await Promise.all(
      events.map((event) => this.eventMapper.toDomain(event))
    );
    const savedEvents = await this.eventService.saveEvents(mapped);
    return Promise.all(
      savedEvents.map((event) => this.eventMapper.toRest(event))
    );
  }

  @Delete("/events/:id")
  @Authenticated()
  @ApiJfds({
    operationId: "deleteEventById",
    type: Event,
  })
  async deleteEventById(@Param("id") id: string) {
    const deletedEvent = await this.eventService.deleteById(id);
    return this.eventMapper.toRest(deletedEvent);
  }
}
