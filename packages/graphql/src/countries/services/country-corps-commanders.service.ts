import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryCorpsCommander } from '../models';
import { Mod } from '../../mods/models/mod.model';
import { CountryMilitaryCommandersService } from './country-military-commanders.service';

@Injectable()
export class CountryCorpsCommandersService extends CountryMilitaryCommandersService {
  constructor(
    @InjectRepository(CountryCorpsCommander)
    private countryCorpsCommandersRepository: Repository<CountryCorpsCommander>,
  ) {
    super();
  }

  async updateById(id, data) {
    return this.countryCorpsCommandersRepository.save({ id, ...data });
  }

  async findAll(mod: Mod): Promise<CountryCorpsCommander[]> {
    return this.countryCorpsCommandersRepository
      .createQueryBuilder('corps_commander')
      .leftJoinAndSelect('corps_commander.history', 'history')
      .leftJoin('history.mod', 'mod')
      .where('mod.id = :modId', { modId: mod.id })
      .getMany();
  }

  private serialize(out: unknown): CountryCorpsCommander {
    return this.countryCorpsCommandersRepository.create({
      commanderId: out['id'],
      name: out['name'],
      description: out['desc'],
      portraitPath: out['portrait_path'],
      skill: out['skill'],
      attackSkill: out['attack_skill'],
      defenseSkill: out['defense_skill'],
      logisticsSkill: out['logistics_skill'],
      planningSkill: out['planning_skill'],
    });
  }

  parse(out: any): CountryCorpsCommander[] {
    if (!out) {
      return [];
    }

    if (!Array.isArray(out)) {
      return [this.serialize(out)];
    }

    return out.map(this.serialize.bind(this));
  }
}