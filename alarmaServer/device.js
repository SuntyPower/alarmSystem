'use strict'

module.exports = function setupDevice (DeviceModel) {


  function findByZone (zone) {
    return DeviceModel.findByAll({
      where:{
        zone
      }
    })
  }

  function findAll () {
    return DeviceModel.findAll()
  }

  function findByUsername (username) {
    return DeviceModel.findAll({
      where: {
        username
      }
    })
  }

  async function createOrUpdate (device) {
    const cond = {
      where: {
        username: device.username
      }
    }

    const existingAgent = await DeviceModel.findOne(cond)

    if (existingAgent) {
      const updated = await DeviceModel.update(device, cond)
      return updated ? DeviceModel.findOne(cond) : existingAgent
    }

    const result = await DeviceModel.create(device)
    return result.toJSON()
  }

  return {
    findByZone,
    findAll,
    findByUsername,
    createOrUpdate

  }
}
