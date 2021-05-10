import { BattleEffect } from '../battleeffect/battleEffects'
import { defaultRoll, UnitInstance, UnitType } from '../unit'

export const yin: BattleEffect[] = [
  {
    type: 'race',
    name: 'Yin flagship',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        // TODO add flagship ability
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 9,
            count: 2,
          },
        }
      } else {
        return unit
      }
    },
  },
  // TODO add devotion
  // TODO add impulse core
  // TODO add agent
]
