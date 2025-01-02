import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Event as EntityEvent } from "src/model";
import { Event } from "../rest";

@Injectable()
export class EventMapper {
  constructor(
    @InjectRepository(EntityEvent)
    private readonly eventRepository: Repository<EntityEvent>
  ) {}

  async toRest(event: EntityEvent): Promise<Event> {
    return {
      ...event,
    };
  }

  async toDomain(event: Event): Promise<EntityEvent> {
    return this.eventRepository.create(event);
  }
}
