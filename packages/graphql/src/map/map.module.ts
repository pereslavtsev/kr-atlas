import { Module } from '@nestjs/common';
import { MapCommand } from './commands/map.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as models from './models';
import { ContinentsService } from './services/continents.service';
import { ProvincesService } from './services/provinces.service';
import { MapsService } from './services/maps.service';
import { SvgService } from './services/svg.service';
import * as resolvers from './resolvers';

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(models))],
  providers: [
    MapCommand,
    ...Object.values(resolvers),
    ContinentsService,
    ProvincesService,
    MapsService,
    SvgService,
  ],
})
export class MapModule {}
