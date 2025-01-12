import { ParticipantInstance, BattleInstance } from '../battle-types'
import { BattleEffect, registerUse } from '../battleeffect/battleEffects'
import { Place, Race } from '../enums'
import { defaultRoll, getUnitWithImproved, UnitInstance, UnitType } from '../unit'
import { getHighestHitUnit } from '../unitGet'

export const baronyOfLetnev: BattleEffect[] = [
  {
    type: 'race',
    name: 'Barony of Letnev flagship',
    place: 'both',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 5,
            count: 2,
          },
          bombardment: {
            ...defaultRoll,
            hit: 5,
            count: 3,
          },
          battleEffects: [
            {
              name: 'Barony flagship remove planetary shield',
              type: 'other',
              place: 'both',
              transformEnemyUnit: (u: UnitInstance) => {
                return {
                  ...u,
                  planetaryShield: false,
                }
              },
            },
            {
              name: 'Barony flagship repair',
              type: 'other',
              place: Place.space,
              onCombatRoundEnd: (participant: ParticipantInstance) => {
                participant.units.forEach((unit) => {
                  if (unit.type === UnitType.flagship) {
                    unit.takenDamage = false
                  }
                })
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
    name: 'Non-Euclidean Shielding',
    description: 'When 1 of your units uses SUSTAIN DAMAGE, cancel 2 hits instead of 1.',
    type: 'race-tech',
    place: 'both',
    race: Race.barony_of_letnev,
    onSustain: (_unit: UnitInstance, participant: ParticipantInstance, _battle: BattleInstance) => {
      if (participant.hitsToAssign.hitsToNonFighters > 0) {
        participant.hitsToAssign.hitsToNonFighters -= 1
      } else if (participant.hitsToAssign.hits > 0) {
        participant.hitsToAssign.hits -= 1
      }
    },
  },
  {
    name: 'L4 Disruptors',
    description: 'During an invasion, units cannot use SPACE CANNON against your units.',
    type: 'race-tech',
    place: Place.ground,
    race: Race.barony_of_letnev,
    transformEnemyUnit: (unit: UnitInstance) => {
      // TODO Order should not be a problem because transform enemy units happen after transform friendly
      // But are we sure it is NEVER a problem?
      return {
        ...unit,
        spaceCannon: undefined,
      }
    },
  },
  {
    name: 'Munitions reserves',
    description:
      'At the start of each round of space combat, you may spend 2 trade goods;  you may re-roll any number of your dice during that combat round.',
    type: 'race-ability',
    place: Place.space,
    race: Race.barony_of_letnev,
    count: true,
    onCombatRound: (
      participant: ParticipantInstance,
      _battle: BattleInstance,
      _otherParticipant: ParticipantInstance,
      effectName: string,
    ) => {
      if (participant.effects[effectName] > 0) {
        participant.units.forEach((unit) => {
          if (unit.combat) {
            unit.combat.rerollBonusTmp += 1
          }
        })
        participant.effects[effectName] -= 1
      }
    },
  },
  {
    name: 'War Funding',
    // TODO this could use the "worse than average" thingy
    description:
      "After you and your opponent roll dice during space combat: You may reroll all of your opponent's dice.  You may reroll any number of your dice. (currently only rerolls your dice).",
    type: 'promissary',
    place: Place.space,
    transformUnit: (unit: UnitInstance) => {
      return getUnitWithImproved(unit, 'combat', 'reroll', 'temp')
    },
  },
  {
    name: 'Barony Agent',
    description:
      'At the start of a Space Combat round: You may exhaust this card to choose 1 ship in the active system. That ship rolls 1 additional die during this combat round.',
    type: 'agent',
    place: Place.space,
    onCombatRound: (
      p: ParticipantInstance,
      _battle: BattleInstance,
      _otherParticipant: ParticipantInstance,
      effectName: string,
    ) => {
      const highestHitUnit = getHighestHitUnit(p, 'combat', Place.space)
      if (highestHitUnit?.combat) {
        highestHitUnit.combat.countBonusTmp += 1
        registerUse(effectName, p)
      }
    },
    timesPerFight: 1,
  },
]
