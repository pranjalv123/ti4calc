import { BattleInstance, ParticipantInstance } from '../battle-types'
import { BattleEffect, registerUse } from '../battleeffect/battleEffects'
import { defaultRoll, UnitInstance, UnitType } from '../unit'
import _times from 'lodash/times'
import { Place, Race } from '../enums'
import { getLowestWorthSustainUnit, getHighestHitUnit } from '../unitGet'
import { LOG } from '../battle'

export const argentFlight: BattleEffect[] = [
  {
    type: 'race',
    name: 'Argent Flight flagship',
    place: Place.space,
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 7,
            count: 2,
          },
          battleEffects: [
            {
              name: 'Argent Flight flagship preventing pds',
              type: 'other',
              place: Place.space,
              transformEnemyUnit: (
                unit: UnitInstance,
                _participant: ParticipantInstance,
                place: Place,
              ) => {
                if (place === Place.space) {
                  // TODO Order should not be a problem because transform enemy units happen after transform friendly
                  // But are we sure it is NEVER a problem?
                  return {
                    ...unit,
                    spaceCannon: undefined,
                  }
                } else {
                  return unit
                }
              },
            },
          ],
        }
      } else {
        return unit
      }
    },
  },
  {
    type: 'race',
    name: 'Argent Flight destroyers',
    place: Place.space,
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.destroyer) {
        unit.combat!.hit = 8
      }
      return unit
    },
    afterAfb: (
      p: ParticipantInstance,
      battle: BattleInstance,
      otherParticipant: ParticipantInstance,
    ) => {
      _times(otherParticipant.hitsToAssign.hits, () => {
        const bestSustainUnit = getLowestWorthSustainUnit(otherParticipant, battle.place, true)
        if (bestSustainUnit) {
          if (LOG) {
            console.log(
              `${
                p.side === 'attacker' ? 'defender' : 'attacker'
              } used sustain damage from Argent anti fighter barrage`,
            )
          }
          bestSustainUnit.takenDamage = true
          bestSustainUnit.takenDamageRound = 0
        }
      })
    },
  },
  {
    type: 'race-tech',
    name: 'Strike Wing Alpha II',
    place: Place.space,
    race: Race.argent_flight,
    unit: UnitType.destroyer,
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.destroyer) {
        unit.combat!.hit = 7
      }
      return unit
    },
    afterAfb: (
      p: ParticipantInstance,
      battle: BattleInstance,
      otherParticipant: ParticipantInstance,
    ) => {
      _times(otherParticipant.hitsToAssign.hits, () => {
        const bestSustainUnit = getLowestWorthSustainUnit(otherParticipant, battle.place, true)
        if (bestSustainUnit) {
          if (LOG) {
            console.log(
              `${
                p.side === 'attacker' ? 'defender' : 'attacker'
              } used sustain damage from Argent anti fighter barrage`,
            )
          }
          bestSustainUnit.takenDamage = true
          bestSustainUnit.takenDamageRound = 0
        }
      })
    },
  },
  {
    type: 'promissary',
    description:
      'When 1 or more of your units make a roll for a unit ability: Choose 1 of those units to roll 1 additional die',
    name: 'Strike Wing Ambuscade',
    place: 'both',
    onSpaceCannon: (
      p: ParticipantInstance,
      _battle: BattleInstance,
      _otherP: ParticipantInstance,
      effectName: string,
    ) => {
      // TODO say in theory that pds is disabled. Would strike wing ambuscade still be used here, if it could be used for afb instead?
      const highestHitUnit = getHighestHitUnit(p, 'spaceCannon', undefined)
      if (highestHitUnit) {
        highestHitUnit.spaceCannon!.countBonusTmp += 1
        registerUse(effectName, p)
      }
    },
    onAfb: (
      p: ParticipantInstance,
      _battle: BattleInstance,
      _otherP: ParticipantInstance,
      effectName: string,
    ) => {
      const highestHitUnit = getHighestHitUnit(p, 'afb', undefined)
      if (highestHitUnit) {
        highestHitUnit.afb!.countBonusTmp += 1
        registerUse(effectName, p)
      }
    },
    onBombardment: (
      p: ParticipantInstance,
      battle: BattleInstance,
      _otherP: ParticipantInstance,
      effectName: string,
    ) => {
      if (p.side === 'attacker' && battle.place === Place.ground) {
        const highestHitUnit = getHighestHitUnit(p, 'bombardment', undefined)
        if (highestHitUnit) {
          highestHitUnit.bombardment!.countBonusTmp += 1
          registerUse(effectName, p)
        }
      }
    },
    timesPerFight: 1,
  },
  {
    type: 'commander',
    description:
      'When 1 or more of your units make a roll for a unit ability: You may choose 1 of those units to roll 1 additional die.',
    name: 'Argent Flight Commander',
    place: 'both',
    onAfb: (p: ParticipantInstance) => {
      const highestHitUnit = getHighestHitUnit(p, 'afb', undefined)
      if (highestHitUnit) {
        highestHitUnit.afb!.countBonusTmp += 1
      }
    },
    onSpaceCannon: (p: ParticipantInstance) => {
      const highestHitUnit = getHighestHitUnit(p, 'spaceCannon', undefined)
      if (highestHitUnit) {
        highestHitUnit.spaceCannon!.countBonusTmp += 1
      }
    },
    onBombardment: (p: ParticipantInstance) => {
      const highestHitUnit = getHighestHitUnit(p, 'bombardment', undefined)
      if (highestHitUnit) {
        highestHitUnit.bombardment!.countBonusTmp += 1
      }
    },
  },
]
