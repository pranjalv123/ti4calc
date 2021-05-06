import { BattleEffect } from '../battleeffect/battleEffects'
import { defaultRoll, UnitInstance, UnitType } from '../unit'

export const baronyOfLetnev: BattleEffect[] = [
  {
    type: 'race',
    name: 'Barony of Letnev flagship',
    transformUnit: (unit: UnitInstance) => {
      // TODO add repair and disable planetary shield
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
        }
      } else {
        return unit
      }
    },
  },
]
