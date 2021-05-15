import getBattleReport from '.'
import { checkResult } from '../util/util.test'
import { getUnitMap } from './battleSetup'
import { Participant } from './battle-types'
import { Place, Race } from './enums'
import { duraniumArmor } from './battleeffect/tech'

export const DO_BATTLE_X_TIMES = 15000

// TODO move out race specific tests

describe('core', () => {
  it('barony should always win with non-euclidian and duranium', () => {
    const attacker: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {
        'Non-Euclidean Shielding': 1,
        [duraniumArmor.name]: 1,
      },
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.dreadnought = 2
    defender.units.dreadnought = 2

    const result = getBattleReport(attacker, defender, Place.space, 100)

    expect(result.draw).toEqual(0)
    expect(result.defender).toEqual(0)
  })

  it('Sardakk vs arborec flagship', () => {
    const attacker: Participant = {
      race: Race.sardakk_norr,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.arborec,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.flagship = 1
    defender.units.flagship = 1

    const result = getBattleReport(attacker, defender, Place.space, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.56)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.26)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.18)
  })

  it('5v5 dreadnaught with duranium', () => {
    const attacker: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {
        [duraniumArmor.name]: 1,
      },
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.dreadnought = 5
    defender.units.dreadnought = 5

    const result = getBattleReport(attacker, defender, Place.space, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.67)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.0167, 0.2)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.313)
  })

  it('Make sure battle effect isnt used if set to 0', () => {
    const attacker: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {
        [duraniumArmor.name]: 0,
      },
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.dreadnought = 2
    defender.units.dreadnought = 2

    const result = getBattleReport(attacker, defender, Place.space, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.438)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.134, 0.1)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.438)
  })

  it('argent flight upgraded destroyers should perform like cruisers', () => {
    const attacker: Participant = {
      race: Race.argent_flight,
      units: getUnitMap(),
      unitUpgrades: {
        destroyer: true,
      },
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.destroyer = 2
    defender.units.cruiser = 2

    const result = getBattleReport(attacker, defender, Place.space, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.443)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.113, 0.15)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.443)
  })

  it('Argent flight flagship prevents pds fire in space', () => {
    const attacker: Participant = {
      race: Race.argent_flight,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.flagship = 1
    attacker.units.destroyer = 2
    defender.units.destroyer = 2
    defender.units.pds = 10

    const result = getBattleReport(attacker, defender, Place.space, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.99)
  })

  it('Using Strike Wing ambuscade', () => {
    const attacker: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: { 'Strike Wing Ambuscade': 1 },
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.destroyer = 2
    attacker.units.pds = 1
    defender.units.destroyer = 2

    const result = getBattleReport(attacker, defender, Place.space, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.8)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.024, 0.2)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.176)
  })

  it('L1z1x flagship makes flagship and dreadnaughts target non-fighter ships', () => {
    const attacker: Participant = {
      race: Race.l1z1x,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.arborec,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.flagship = 1
    attacker.units.dreadnought = 4
    defender.units.dreadnought = 5
    defender.units.fighter = 3

    const result = getBattleReport(attacker, defender, Place.space, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.296)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.021, 0.2)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.682)
  })

  it('basic ground combat', () => {
    const attacker: Participant = {
      race: Race.argent_flight,
      units: getUnitMap(),
      unitUpgrades: {
        infantry: true,
      },
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.infantry = 2
    defender.units.mech = 2

    const result = getBattleReport(attacker, defender, Place.ground, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.033, 0.2)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.017, 0.2)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.949)
  })

  // TODO add test to ensure that sardakk flagship does not affect ground combat

  it('ground combat with bombardment', () => {
    const attacker: Participant = {
      race: Race.argent_flight,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.infantry = 3
    attacker.units.dreadnought = 3
    defender.units.infantry = 3

    const result = getBattleReport(attacker, defender, Place.ground, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.904)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.014, 0.5)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.081, 0.15)
  })

  it('ground combat with bombardment but also planetary shield', () => {
    const attacker: Participant = {
      race: Race.argent_flight,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.infantry = 3
    attacker.units.dreadnought = 3
    defender.units.infantry = 3
    defender.units.pds = 1

    const result = getBattleReport(attacker, defender, Place.ground, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.316)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.037, 0.2)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.646)
  })

  it('ground combat with bombardment but also planetary shield... but the planetary shield is DISABLED', () => {
    const attacker: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.infantry = 3
    attacker.units.flagship = 1
    defender.units.infantry = 3
    defender.units.pds = 1

    const result = getBattleReport(attacker, defender, Place.ground, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.82)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.028, 0.2)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.152)
  })

  it('ground combat with l1z1x harrow ability', () => {
    const attacker: Participant = {
      race: Race.l1z1x,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'attacker',
      battleEffects: {},
    }
    const defender: Participant = {
      race: Race.barony_of_letnev,
      units: getUnitMap(),
      unitUpgrades: {},
      riskDirectHit: false,
      side: 'defender',
      battleEffects: {},
    }
    attacker.units.dreadnought = 3
    attacker.units.infantry = 5
    defender.units.infantry = 8

    const result = getBattleReport(attacker, defender, Place.ground, DO_BATTLE_X_TIMES)

    checkResult(result.attacker, DO_BATTLE_X_TIMES * 0.803)
    checkResult(result.draw, DO_BATTLE_X_TIMES * 0.063, 0.2)
    checkResult(result.defender, DO_BATTLE_X_TIMES * 0.132, 0.1)
  })
})
